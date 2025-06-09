import React from 'react';
import type { ReactElement } from 'react';
import { render, cleanup } from '@testing-library/react';
import { performance } from 'perf_hooks';
import os from 'os';
import path from 'path';
import { writeFileSync } from 'fs';
import styled, { ThemeProvider } from 'styled-components';

afterEach(cleanup);

const withProvider = (element: ReactElement) => <ThemeProvider theme={{}}>{element}</ThemeProvider>;

const benchmarkRender = (
  Component: React.ComponentType<any>,
  props: Record<string, any> = {},
  runs: number,
): number => {
  const start = performance.now();

  for (let i = 0; i < runs; i++) {
    const { unmount } = render(withProvider(<Component {...props}>content {i}</Component>));

    unmount();
  }

  const end = performance.now();

  return end - start;
};

const RENDERS = 10_000;

const benchmarkResults: Record<
  string,
  {
    renders: number;
    totalTimeMs: number;
  }
> = {};

afterAll(() => {
  const filename = path.join('benchmarks', 'styled-components.json');

  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  const machineStats = {
    cpu: cpus[0].model,
    cores: cpus.length,
    totalMemoryGB: parseFloat((totalMem / 1024 ** 3).toFixed(2)),
    freeMemoryGB: parseFloat((freeMem / 1024 ** 3).toFixed(2)),
    platform: `${os.platform()} ${os.arch()}`,
    node: process.version,
  };

  const output = {
    machine: machineStats,
    benchmarks: benchmarkResults,
  };

  writeFileSync(filename, JSON.stringify(output, null, 2));

  console.log(
    '✅ Saved benchmark results and machine stats to "benchmarks/styled-components.json"',
  );
});

describe('[styled-components]: performance', () => {
  const logPerf = (id: string, totalMs: number, renders: number) => {
    benchmarkResults[id] = {
      renders,
      totalTimeMs: parseFloat(totalMs.toFixed(2)),
    };

    const avgMs = totalMs / renders;

    console.log(
      [
        `[PERF]: ${id}`,
        `  Total time for ${renders.toLocaleString()} runs: ${totalMs.toFixed(2)}ms`,
        `  Average render time: ${avgMs.toFixed(4)}ms`,
        '',
      ].join('\n'),
    );
  };

  it('should measure render time for basic styled component', () => {
    const Box = styled.div``;

    const duration = benchmarkRender(Box, {}, RENDERS);

    logPerf('basicBox', duration, RENDERS);
  });

  it('should measure render time for nested styled component', () => {
    const Base = styled.div``;

    const Extended = styled(Base)`
      color: red;
    `;

    const duration = benchmarkRender(Extended, {}, RENDERS);

    logPerf('extendedBox', duration, RENDERS);
  });

  it('should measure render time for dynamic styles via props', () => {
    const Box = styled.div<{ color: string }>`
      color: ${({ color }) => color};
    `;

    const duration = benchmarkRender(Box, { color: 'blue' }, RENDERS);

    logPerf('dynamicBoxViaProps', duration, RENDERS);
  });

  it('should measure render time for polymorphic `as` prop', () => {
    const Box = styled.div``;

    const duration = benchmarkRender(Box, { as: 'a', href: '#' }, RENDERS);

    logPerf('boxWithAsProp', duration, RENDERS);
  });
});
