export interface ISubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  export interface IPushMessage {
    message: {
      icon: string;
      title: string;
      body: string;
      url: string;
      imageUrl: string;
    };
    users: string[];
    TEC_ClienteCodigo: number;
    TEC_AplicacaoId: number;
    hashExterno:string;
  }
  