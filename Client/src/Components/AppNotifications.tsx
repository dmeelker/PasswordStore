import React from 'react';
import NotificationService from '../Services/NotificationService';
import { useObservable } from '../Model/Observable';

export function AppNotifications() {
  const notifications = useObservable(NotificationService.notifications);

  if (notifications.length > 0) {
    return <div className="fixed" style={{ left: "50%", transform: "translate(-50%, 0)" }}>
      {notifications.map((notification) => <div key={notification.id} className="bg-green-400 border-b-2 border-green-600 px-4 py-2 rounded shadow mb-1 text-sm text-center">{notification.message}</div>)}
    </div>;
  }
  else {
    return null;
  }
}
