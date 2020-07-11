import 'jest-extended';
import 'jest-expect-message';

declare global {
    namespace jest {
        interface Expect {
            <T = any>(actual: T, message?: string): Matchers<T>;
        }

    }
}