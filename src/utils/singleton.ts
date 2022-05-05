export interface ISingletonStatic<T> {
    instance: T;

    getInstance(): T

}