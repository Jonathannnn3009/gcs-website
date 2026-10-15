// Hands a visitor from the website's "Track Application" page to the CRM's sign-in page without putting
// anything private in the address. On the live site the website and the CRM share one origin, so a short-lived
// note in sessionStorage reaches the CRM page, which reads it once and deletes it. (Locally, where they run on
// different ports, the note simply does not arrive and the visitor types the details again.)

export type TrackHandoff =
  { kind: "client"; phone: string; code: string } | { kind: "partner"; phone: string };

export const TRACK_HANDOFF_KEY = "gcs.track.handoff";

export function leaveHandoff(note: TrackHandoff) {
  try {
    window.sessionStorage.setItem(TRACK_HANDOFF_KEY, JSON.stringify({ ...note, at: Date.now() }));
  } catch {
    // storage blocked: the CRM page just asks for the details
  }
}
