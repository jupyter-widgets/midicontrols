// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import { IObservableDisposable } from '@lumino/disposable';
import { Signal, ISignal } from '@lumino/signaling';

export
class Disposable implements IObservableDisposable {
  /**
   * Dispose of the button.
   *
   * #### Notes
   * It is unsafe to use the button after it has been disposed.
   *
   * All calls made to this method after the first are a no-op.
   */
  dispose(): void {
    // Do nothing if the widget is already disposed.
    if (this.isDisposed) {
      return;
    }

    this._isDisposed = true;
    this._disposed.emit(undefined);

    // Clear the extra data associated with the widget.
    Signal.clearData(this);
  }

  /**
   * Test whether the widget has been disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * A signal emitted when the widget is disposed.
   */
  get disposed(): ISignal<this, void> {
    return this._disposed;
  }

  private _isDisposed = false;
  private _disposed = new Signal<this, void>(this);
}
