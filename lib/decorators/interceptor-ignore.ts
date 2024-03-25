export function InterceptorIgnore(ignore: symbol | string) {
  return function (
    _target,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value[ignore] = true;
  };
}
