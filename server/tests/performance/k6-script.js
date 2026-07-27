import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const errorRate = new Rate("errors");
const loginDuration = new Trend("login_duration");
const chatFetchDuration = new Trend("chat_fetch_duration");
const messageSendDuration = new Trend("message_send_duration");

export const options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 500 },
    { duration: "1m", target: 500 },
    { duration: "30s", target: 1000 },
    { duration: "1m", target: 1000 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.05"],
    errors: ["rate<0.1"],
  },
};

const users = [];
for (let i = 0; i < 1000; i++) {
  users.push({
    username: `loaduser_${i}`,
    email: `loaduser_${i}@test.com`,
    password: "testpassword123",
  });
}

export default function () {
  const userIndex = __VU % users.length;
  const user = users[userIndex];

  const registerRes = http.post(`${BASE_URL}/api/users/register`, {
    username: `${user.username}_${__ITER}`,
    name: `Load User ${userIndex}`,
    email: `${user.username}_${__ITER}@test.com`,
    password: user.password,
  });

  check(registerRes, {
    "register success": (r) => r.status === 201,
  }) || errorRate.add(1);

  sleep(0.5);

  const loginStart = Date.now();
  const loginRes = http.post(`${BASE_URL}/api/users/login`, {
    email: `${user.username}_${__ITER}@test.com`,
    password: user.password,
  });
  loginDuration.add(Date.now() - loginStart);

  const loginSuccess = check(loginRes, {
    "login success": (r) => r.status === 200,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    sleep(1);
    return;
  }

  const cookies = loginRes.cookies;
  const jar = http.cookieJar();
  if (cookies.accessToken && cookies.accessToken.length > 0) {
    jar.set(BASE_URL, "accessToken", cookies.accessToken[0].value);
  }
  if (cookies.refreshToken && cookies.refreshToken.length > 0) {
    jar.set(BASE_URL, "refreshToken", cookies.refreshToken[0].value);
  }

  const chatStart = Date.now();
  const chatRes = http.get(`${BASE_URL}/api/chats`);
  chatFetchDuration.add(Date.now() - chatStart);

  check(chatRes, {
    "chats fetched": (r) => r.status === 200,
  }) || errorRate.add(1);

  const profileRes = http.get(`${BASE_URL}/api/users/profile`);

  check(profileRes, {
    "profile fetched": (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);
}
