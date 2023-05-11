import {BuiltIns} from './internal';

type ExcludeUndefined<T> = Exclude<T, undefined>;

/**
Create a type from another type with all keys and nested keys set to required.

@example
```
import type {RequiredDeep} from 'type-fest';

type Settings = {
	textEditor?: {
		fontSize?: number | undefined;
		fontColor?: string | undefined;
		fontWeight?: number | undefined;
	}
	autocomplete?: boolean | undefined;
	autosave?: boolean | undefined;
};

type RequiredSettings = RequiredDeep<Settings>;
Result: {
	textEditor: {
		fontSize: number;
		fontColor: string;
		fontWeight: number;
	}
	autocomplete: boolean;
	autosave: boolean;
}
```

 @category Utilities
 @category Object 
 @category Array 
 @category Set 
 @category Map 
 */
export type RequiredDeep<T, E extends ExcludeUndefined<T> = ExcludeUndefined<T>> = E extends BuiltIns
	? E
	: E extends Map<infer KeyType, infer ValueType>
		? Map<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
		: E extends Set<infer ItemType>
			? Set<RequiredDeep<ItemType>>
			: E extends ReadonlyMap<infer KeyType, infer ValueType>
				? ReadonlyMap<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
				: E extends ReadonlySet<infer ItemType>
					? ReadonlySet<RequiredDeep<ItemType>>
					: E extends (...args: any[]) => unknown
						? E
						: E extends object
							? E extends Array<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
								? ItemType[] extends E // Test for arrays (non-tuples) specifically
									? Array<RequiredDeep<ItemType>> // Recreate relevant array type to prevent eager evaluation of circular reference
									: RequiredObjectDeep<E> // Tuples behave properly
								: RequiredObjectDeep<E>
							: unknown;

type RequiredObjectDeep<ObjectType extends object> = {
	[KeyType in keyof ObjectType]-?: RequiredDeep<ObjectType[KeyType]>
};