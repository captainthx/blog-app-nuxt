<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";
import type { AccountResponse } from "~/types";

import { Client, type IFrame, type StompSubscription } from "@stomp/stompjs";

interface Users {
  alt: string;
}

const authStore = useAuthStore();
const token = authStore.token?.accessToken;

const userData = ref<any>({
  username: "",
  receiverName: "",
  connected: false,
});
let subscription: StompSubscription;
const publicChats = ref<string[]>([]);
const privateChats = ref<any>(new Map());
const connectedUsers = ref<string[]>([]);
const onlineUsers = ref<AccountResponse[]>();

const message = ref<string>("");

const client = new Client({
  brokerURL: "ws://localhost:8080/ws",
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  debug: (str) => {
    console.log("error : ", str);
  },
});

const connect = () => {
  client.onConnect = onConnected;
  client.onStompError = onError;
  client.activate();
};

const onConnected = (frame: IFrame) => {
  console.log("connected :", frame);
  if (authStore.tokenPayload) {
    userData.value = userData.value = {
      username: authStore.tokenPayload.sub,
      connected: true,
    };
  }
  client.subscribe("/chatroom/public", onMessageReceived);
  // subscription = client.subscribe("/chatroom/users", onUserList);
  // client.subscribe(
  //   "/user/" + userData.value.username + "/private",
  //   onPrivateMessage
  // );
  userJoin();
};

const onUserList = (payload: any) => {
  let payloadData = JSON.parse(payload.body);
  connectedUsers.value = payloadData;
  onlineUsers.value = payloadData;
  console.log("connected users", connectedUsers.value);
};
const userJoin = () => {
  if (authStore.tokenPayload) {
    userData.value.username = authStore.tokenPayload.sub;
    let chatMessage = {
      senderName: userData.value.username,
      status: "JOIN",
    };
    client.publish({
      destination: "/app/message",
      body: JSON.stringify(chatMessage),
    });
  }
};

const disconnect = () => {
  subscription.unsubscribe();
  client.deactivate();
  userData.value = { ...userData, connected: false };
};

const onMessageReceived = (payload: any) => {
  let payloadData = JSON.parse(payload.body);
  switch (payloadData.status) {
    case "JOIN":
      if (!privateChats.value.get(payloadData.senderName)) {
        privateChats.value.set(payloadData.senderName, []);
        privateChats.value = new Map(privateChats.value);
      }
      break;
    case "MESSAGE":
      publicChats.value.push(payloadData);
      publicChats.value = [...publicChats.value];
      break;
    case "LEAVE":
      privateChats.value.delete(payloadData.senderName);
      privateChats.value = new Map(privateChats.value);
      break;
  }
};

const onPrivateMessage = (payload: any) => {
  let payloadData = JSON.parse(payload.body);
  if (privateChats.value.get(payloadData.senderName)) {
    privateChats.value.get(payloadData.senderName).push(payloadData);
    privateChats.value = new Map(privateChats.value);
  } else {
    let list = [];
    list.push(payloadData);
    privateChats.value.set(payloadData.senderName, list);
    privateChats.value = new Map(privateChats.value);
  }
  updatedConnectedUsers(payloadData.senderName);
};

const updatedConnectedUsers = (senderName: string) => {
  connectedUsers.value = [...new Set([...connectedUsers.value, senderName])];
};

const onError = (err: any) => {
  console.log("error", err);
};

const sendValue = () => {
  if (message) {
    console.log("username ", userData.value.username);
    let chatMessage = {
      senderName: userData.value.username,
      message: message.value,
      status: "MESSAGE",
    };
    client.publish({
      destination: "/app/message",
      body: JSON.stringify(chatMessage),
    });
    userData.value = {
      ...userData,
    };
  }
};

const sendPrivateMessage = () => {
  if (client) {
    let chartMessage = {
      senderName: userData.value.username,
      receiverName: "user",
      message: message,
      status: "MESSAGE",
    };
    client.publish({
      destination: "/app/private/" + "user",
      body: JSON.stringify(chartMessage),
    });

    // userData.value = {
    //   ...userData,
    // };
  }
};
onMounted(() => {
  connect();
});
</script>

<template>
  <h1>chat page</h1>
  <div class="max-w-full">
    <ATabs />
    <UCard>
      <template #header>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          show message
        </p>
        <UButton @click="disconnect">disconnect</UButton>
      </template>
      {{ publicChats }}
      <div class="flex flex-row items-center gap-2">
        <UTextarea
          class="w-full"
          :rows="1"
          placeholder="Input message"
          v-model="message"
        />
        <UButton color="blue" @click="sendValue">send</UButton>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
