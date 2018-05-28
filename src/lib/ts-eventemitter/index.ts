import { EventEmitter } from 'events';

/**
 * An `EventEmitter` with strictly typed events.
 * 
 * `T` is an object whose keys are the event name and whose values
 * are the argument type passed to the respective event type.
 */
export class TypedEventEmitter<T> extends EventEmitter {
    addListener(event: keyof T, listener: (arg: T[typeof event]) => void): this {
        return super.addListener(event, listener);
    }
    on(event: keyof T, listener: (arg: T[typeof event]) => void): this {
        return super.on(event, listener);
    }
    once(event: keyof T, listener: (arg: T[typeof event]) => void): this {
        return super.once(event, listener);
    }
    prependListener(event: keyof T, listener: (arg: T[typeof event]) => void): this {
        return super.prependListener(event, listener);
    }
    prependOnceListener(event: keyof T, listener: (arg: T[typeof event]) => void): this {
        return super.prependOnceListener(event, listener);
    }
    removeListener(event: keyof T, listener: (arg: T[typeof event]) => void): this {
        return super.removeListener(event, listener);
    }
    removeAllListeners(event?: keyof T): this {
        return super.removeAllListeners(event);
    }
    listeners(event: keyof T): Function[] {
        return super.listeners(event);
    }
    rawListeners(event: keyof T): Function[] {
        return super.rawListeners(event);
    }
    eventNames(): Array<keyof T> {
        return super.eventNames() as any;
    }
    listenerCount(type: keyof T): number {
        return super.listenerCount(type);
    }
    emit(event: keyof T, arg: T[typeof event]): boolean {
        return super.emit(event, arg);
    }
}

/**
 * A `TypedEventEmitter` class that can only emit events from within the class.
 * 
 * `EventEmitter#emit` does nothing and always returns false. Use `ProtectedEventEmitter#protectedEmit`
 * to emit events from within the class
 */
export class ProtectedEventEmitter<T> extends TypedEventEmitter<T> {
    /**
     * @deprecated _NOP_, use `PrivateEventEmitter#privateEmit` to emit events from 
     */
    emit(event: keyof T, arg: T[typeof event]): boolean {
        return false;
    }
    protected protectedEmit(event: keyof T, arg: T[typeof event]): boolean {
        return super.emit(event, arg);
    }
}
