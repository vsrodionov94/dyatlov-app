import { AnswerData, AnswerUserData, CheckAudioData, CheckKeyData, GetData, RandomUserData, TryAnswerUserData, TryAudioData, TryKeyData, TrySendUserData, UserForAnswerData, CheckUserData } from "../types";


class Api {
  private url: string;
  private headers: { "Content-type": string; };

  constructor(config: { url: string, headers: { "Content-type": string } }) {
    this.url = config.url;
    this.headers = config.headers;
  }

  private handleResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error(`Ошибка: ${res.status}`));
  }

  public checkUser(data: GetData): Promise<CheckUserData> {
    return fetch(`${this.url}/checkUser`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }

  public doneTutorial(data: GetData): Promise<{ }> {
    return fetch(`${this.url}/doneTutorial`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }

  public getRandomUser(data: GetData): Promise<RandomUserData> {
    return fetch(`${this.url}/getRandomUser`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }

  public trySendUser(data: AnswerUserData): Promise<TrySendUserData> {
    return fetch(`${this.url}/getRandomUser`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }

  public getUserForAnswer(data: GetData): Promise<UserForAnswerData> {
    return fetch(`${this.url}/getUserForAnswer`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }

  public tryAnswerUser(data: AnswerUserData): Promise<TryAnswerUserData> {
    return fetch(`${this.url}/tryAnswerUser`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }
  
  public checkKey(data: GetData): Promise<CheckKeyData> {
    return fetch(`${this.url}/checkKey`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }
  
  public tryAnswerKey(data: AnswerData): Promise<TryKeyData> {
    return fetch(`${this.url}/tryAnswerKey`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }

  public checkAudio(data: GetData): Promise<CheckAudioData> {
    return fetch(`${this.url}/checkAudio`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }

  public tryAnswerAudio(data: AnswerData): Promise<TryAudioData> {
    return fetch(`${this.url}/tryAnswerAudio`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this.handleResponseData);
  }
  
}

const api = new Api({
  url: process.env.API,
  headers: {
    "Content-type": "application/json",
  },
});

export default api;
