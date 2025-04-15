import { addDeleteControl, addStyleToObject } from "./ui.utils";

export class HistoryManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.history = [];
    this.restoreEffects = []; // Array of { __id__, callback }
    this.defaultEffects = []; // Array of functions
    this.currentIndex = 0;
    this.maxHistoryLen = 10;
    this.preventPush = false;

    this.canvas.on("object:modified", (e) => {
      this.push(e.target);
      addDeleteControl(e.target.canvas);
      addStyleToObject(e.target.canvas);
    });
    this.canvas.on("object:added", (e) => {
      this.push(e.target);

      addDeleteControl(e.target.canvas);
      addStyleToObject(e.target.canvas);
    });
    this.canvas.on("object:removed", (e) => {
      this.push(e.target);
    });

    this.history.push(this.canvas.toObject(["__id__"]));
  }

  add(el, restoreEffect) {
    const __id__ = this.randomUUID();
    el.__id__ = __id__;
    this.canvas.add(el);
    this.restoreEffects.push({
      __id__,
      callback: restoreEffect,
    });
  }

  remove(el) {
    this.canvas.remove(el);
  }

  prev() {
    if (this.currentIndex === 0) return;
    this.currentIndex--;
    this.renderWithEventListener();
  }

  next() {
    if (this.currentIndex >= this.history.length - 1) return;
    this.currentIndex++;
    this.renderWithEventListener();
  }

  async renderWithEventListener() {
    this.preventPush = true;
    const jsonData = this.getCurrentHistoryData();
    const canvas = await this.canvas.loadFromJSON(jsonData);
    canvas.requestRenderAll();

    const objects = canvas.getObjects();
    for (const obj of objects) {
      const effect = this.restoreEffects.find((e) => e.__id__ === obj.__id__);
      if (effect?.callback) await effect.callback(obj);

      // Ensure delete control and style are applied after each state change
      addDeleteControl(obj.canvas);
      addStyleToObject(obj.canvas);
    }

    this.preventPush = false;
  }

  restore(history, index = -1) {
    this.history = history;
    const jsonData = this.history.at(index);
    this.canvas.loadFromJSON(jsonData).then((canvas) => {
      canvas.requestRenderAll();
      // Reapply custom effects to each object
      const objects = canvas.getObjects();
      for (const obj of objects) {
        addDeleteControl(obj.canvas); // Ensure delete controls are added
        addStyleToObject(obj.canvas); // Ensure styles are applied

        for (const callback of this.defaultEffects) {
          callback(obj);
        }
      }
    });
  }

  addDefaultEffects(...callbacks) {
    this.defaultEffects.push(...callbacks);
  }

  push() {
    if (this.preventPush) return;

    // Remove future history if we undo and then change something
    if (this.history.length > this.currentIndex + 1) {
      this.history.splice(this.currentIndex + 1);
    }

    // Limit history size
    if (this.history.length >= this.maxHistoryLen) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }

    this.history.push(this.canvas.toObject(["__id__"]));
  }

  getCurrentHistoryData() {
    const data = this.history.at(this.currentIndex);
    if (!data) throw new Error("No history found");
    return data;
  }

  randomUUID() {
    const makeRand = () => Math.random().toString(36).slice(2, -1);
    return `${makeRand()}-${makeRand()}-${makeRand()}-${makeRand()}`.toUpperCase();
  }
}
