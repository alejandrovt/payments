import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api-sandbox.circle.com/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization:
      'Bearer QVBJX0tFWTowZTJmMzA5YTg1ZWVhYTEwNzliMWY2ZjVhYjE2MTU5OTplMDRmMDVkM2EwMDg0ZmViYmVmNTA1ZmI0ZmFjMzcxNg==',
  },
});

export default {
  getData: (url: string) =>
    instance({
      method: 'GET',
      url: url,
      params: {
        search: 'parameter',
      },
    }),
  postData: (url: string, data: any) =>
    instance({
      method: 'POST',
      url: url,
      data: data,
    }),
};
