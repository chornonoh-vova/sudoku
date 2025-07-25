import { useRef } from "react";

class MoveNode {
  row: number;
  col: number;
  prevNum: number;
  nextNum: number;
  prev: MoveNode | null;
  next: MoveNode | null;

  constructor(row: number, col: number, prevNum: number, nextNum: number) {
    this.row = row;
    this.col = col;
    this.prevNum = prevNum;
    this.nextNum = nextNum;
    this.prev = null;
    this.next = null;
  }

  data() {
    return {
      row: this.row,
      col: this.col,
      prev: this.prevNum,
      next: this.nextNum,
    };
  }
}

class MoveHistory {
  #head: MoveNode;
  #curr: MoveNode;

  constructor() {
    this.#head = new MoveNode(-1, -1, -1, -1);
    this.#curr = this.#head;
  }

  move(row: number, col: number, prevNum: number, nextNum: number) {
    const node = new MoveNode(row, col, prevNum, nextNum);

    this.#curr.next = null;

    this.#curr.next = node;
    node.prev = this.#curr;

    this.#curr = node;
  }

  canUndo(): boolean {
    return this.#curr !== this.#head;
  }

  undo() {
    const data = this.#curr.data();

    if (this.#curr.prev !== null) {
      this.#curr = this.#curr.prev;
    }

    return { row: data.row, col: data.col, num: data.prev };
  }

  canRedo(): boolean {
    return this.#curr.next !== null;
  }

  redo() {
    if (this.#curr.next !== null) {
      this.#curr = this.#curr.next;
    }

    const data = this.#curr.data();
    return { row: data.row, col: data.col, num: data.next };
  }
}

export function useMoveHistory() {
  const history = useRef(new MoveHistory());

  const move = (row: number, col: number, prev: number, next: number) =>
    history.current.move(row, col, prev, next);
  const canUndo = () => history.current.canUndo();
  const canRedo = () => history.current.canRedo();

  const undo = () => history.current.undo();
  const redo = () => history.current.redo();

  return { move, canUndo, undo, canRedo, redo };
}
