import {v4 as uuid} from "uuid";
import { Observable } from "./Observable";

type ExpireCallback = (notification: Notification) => void;

class Notification {
    public id: string = uuid();
    private timeoutId: number = 0

    constructor(public message: string, public expireCallback: ExpireCallback) {
        this.timeoutId = window.setTimeout(() => {
            this.expireCallback(this);
        }, 3000);
    }
}

class NotificationService {
    public notifications = new Observable<Notification[]>([]);

    public get any() {
        return true;
    }

    public showNotification(message: string) {
        const notification = new Notification(message, (notification) => this.notificationExpired(notification));
        this.notifications.set([...this.notifications.get(), notification]);
    }

    private notificationExpired(notification: Notification) {
        this.notifications.set(this.notifications.get().filter(n => n !== notification));
    }
}

export default new NotificationService();