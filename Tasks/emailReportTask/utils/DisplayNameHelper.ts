export class DisplayNameHelper {

  public static getPriorityDisplayName(priority: string): string {
    const priorityInt = Number.parseInt(priority);
    if (!isNaN(priorityInt) && priorityInt == 255) {
      return "Priority unspecified";
    }
    return `Priority: ${priority}`;
  }
}