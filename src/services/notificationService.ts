import { addNotification } from './cloudSync';
import { NotificationItem } from '../types';

// Gentle pleasant soft chime via Web Audio API
function playChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio might be blocked before user interaction
  }
}

export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return 'denied';
  }
}

export function getPushPermissionStatus(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

export function sendPushNotification(
  title: string,
  body: string,
  options?: {
    type?: NotificationItem['type'];
    link?: string;
    icon?: string;
  }
) {
  playChime();

  // 1. Add to local notification center history
  addNotification({
    title,
    message: body,
    type: options?.type || 'donation',
    link: options?.link,
  });

  // 2. Fire browser desktop notification if supported and granted
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const icon = options?.icon || '/logo.png';
      const n = new Notification(title, {
        body,
        icon,
        badge: icon,
        tag: 'raah-e-khidmah',
      });

      n.onclick = () => {
        window.focus();
        if (options?.link) {
          window.location.hash = options.link;
        }
      };
    } catch (e) {
      console.warn('Browser push notification could not be shown:', e);
    }
  }
}
