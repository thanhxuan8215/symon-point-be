# Typescript coding style guide

## Naming

The name of a variable, function, or class, should answer all the big questions. It should tell you why it exists, what it does, and how it is used. If a name requires a comment, then the name does not reveal its intent.

**Use meaningful variable names.**

Distinguish names in such a way that the reader knows what the differences offer.

Bad:

 ``` typescript
 function isBetween(a1: number, a2: number, a3: number): boolean {
   return a2 <= a1 && a1 <= a3;
 }
```

Good: 

``` typescript
 function isBetween(value: number, left: number, right: number): boolean {
   return left <= value && value <= right;
 }
```

**Use pronounceable variable names**

If you can't pronounce it, you can't discuss it without sounding weird.

Bad:

``` typescript
class Subs {
  public ccId: number;
  public billingAddrId: number;
  public shippingAddrId: number;
}
```

Good:

``` typescript
class Subscription {
  public creditCardId: number;
  public billingAddressId: number;
  public shippingAddressId: number;
}
```

**Avoid mental mapping**

Explicit is better than implicit.<br />
*Clarity is king.*

Bad:

``` typescript
const u = getUser();
const s = getSubscription();
const t = charge(u, s);
```

Good:

``` typescript
const user = getUser();
const subscription = getSubscription();
const transaction = charge(user, subscription);
```

**Don't add unneeded context**

If your class/type/object name tells you something, don't repeat that in your variable name.

Bad:

``` typescript
type Car = {
  carMake: string;
  carModel: string;
  carColor: string;
}

function print(car: Car): void {
  console.log(`${car.carMake} ${car.carModel} (${car.carColor})`);
}
```

Good:

``` typescript
type Car = {
  make: string;
  model: string;
  color: string;
}

function print(car: Car): void {
  console.log(`${car.make} ${car.model} (${car.color})`);
}
```

## Naming Conventions

* Use camelCase for variable and function names

Bad:

``` typescript
var FooVar;
function BarFunc() { }
```

Good:

``` typescript
var fooVar;
function barFunc() { }
```

* Use const, let for variables

Bad:

``` typescript
var foo;
```

Good:

``` typescript
let foo;
```

* Variable name for object

Bad:

``` typescript
const f = new Foo();
const foo1 = new Foo();
```

Good:

``` typescript
const foo = new Foo();
const newFoo = new Foo();
```

* Variable name for array

Bad:

``` typescript
const foo = [];
const fooData = [];
```

Good:

``` typescript
const foos = [];
const newFoos = [];
```

* Use PascalCase for class names, type names and interface names

Bad:

``` typescript
class foo { }
```

Good:

``` typescript
class Foo { }
```

* Use camelCase for class members, type members, interface members and methods

Bad:

``` typescript
class Foo {
  Bar: number;
  Baz() { }
}
```

Good:

``` typescript
class Foo {
  bar: number;
  baz() { }
}
```

* Use camelCase for method parameters

Bad:

``` typescript
function isBetween(Value: number, Left: number, Right: number): boolean {
   return left <= value && value <= right;
 }
```

Good:

``` typescript
function isBetween(value: number, left: number, right: number): boolean {
   return left <= value && value <= right;
 }
```

* Don't prefix with I for interfaces

Bad:

``` typescript
interface IFoo {
}
```

Good:

``` typescript
interface Foo {
}
```

* Use PascalCase for enum names and enum members

Bad:

``` typescript
enum notificationTypes {
  default = 0,
  info = 1,
  success = 2,
  rrror = 3,
  warning = 4
}
```

Good:

``` typescript
enum NotificationTypes {
  Default = 0,
  Info = 1,
  Success = 2,
  Error = 3,
  Warning = 4
}
```

### Naming Booleans

* Don't use negative names for boolean variables.

Bad:

``` typescript
const isNotEnabled = true;
```

Good:

``` typescript
const isEnabled = false;
```

* A prefix like is, are, or has helps every developer to distinguish a boolean from another variable by just looking at it

Bad:

``` typescript
const enabled = false;
```

Good:

``` typescript
const isEnabled = false;
```

### Spaces

Use 2 spaces. Not tabs.

### Semicolons

Use semicolons.