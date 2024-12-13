export function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diff = Math.abs(date2.getTime() - date1.getTime());
    const days = Math.floor(diff / oneDay);
    return days;
  }

export function isNull(obj: any): boolean {
    if (
      typeof obj === "undefined" ||
      obj === null ||
      obj === undefined ||
      obj === ""
    ) {
      return true;
    }
    return false;
}