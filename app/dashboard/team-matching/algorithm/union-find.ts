export class UnionFind {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(ids: string[]) {
    this.parent = new Map(ids.map((id) => [id, id]));
    this.rank = new Map(ids.map((id) => [id, 0]));
  }

  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): void {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return;

    const rankX = this.rank.get(rx) ?? 0;
    const rankY = this.rank.get(ry) ?? 0;

    if (rankX < rankY) {
      this.parent.set(rx, ry);
    } else if (rankX > rankY) {
      this.parent.set(ry, rx);
    } else {
      this.parent.set(ry, rx);
      this.rank.set(rx, rankX + 1);
    }
  }

  getGroup(id: string): string[] {
    const root = this.find(id);
    return [...this.parent.keys()].filter((k) => this.find(k) === root);
  }

  getGroups(): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    for (const id of this.parent.keys()) {
      const root = this.find(id);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(id);
    }
    return groups;
  }
}
