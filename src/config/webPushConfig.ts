import webPush from 'web-push';

webPush.setVapidDetails('https://localhost:3333', String(process.env.PUBLIC_VAPID_KEY), String(process.env.PRIVATE_VAPID_KEY));

export default webPush;
