import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/tests/setup.ts'],
        fileParallelism: false, // 串行运行以避免数据库竞争 (替代 deprecated 的 threads: false)
        hookTimeout: 20000,
        testTimeout: 20000,
    },
});
