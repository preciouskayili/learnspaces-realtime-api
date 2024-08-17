import { Context } from "hono";

interface Participant {
  peerId: string;
  userId: string;
}

interface Pod {
  id: string;
  participants: Participant[];
}

export class AudioCallController {
  private static pods: Map<string, Pod> = new Map();

  static async joinCall(c: Context) {
    const { peerId, userId, podId } = await c.req.json();

    let pod = AudioCallController.pods.get(podId);

    if (!pod) {
      pod = { id: podId, participants: [] };
      AudioCallController.pods.set(podId, pod);
    }

    const existingParticipant = pod.participants.find(
      (p) => p.userId === userId
    );

    if (existingParticipant) {
      existingParticipant.peerId = peerId;
    } else {
      pod.participants.push({ peerId, userId });
    }

    return c.json({
      participants: pod.participants.map((p) => p.peerId),
      isNewPod: pod.participants.length === 1,
    });
  }

  static async leaveCall(c: Context) {
    const { userId, podId } = await c.req.json();

    const pod = AudioCallController.pods.get(podId);

    if (pod) {
      pod.participants = pod.participants.filter((p) => p.userId !== userId);

      if (pod.participants.length === 0) {
        AudioCallController.pods.delete(podId);
      }
    }

    return c.json({ success: true });
  }
}
