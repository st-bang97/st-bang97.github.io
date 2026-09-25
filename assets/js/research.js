/*
 * "Across the system stack" diagram on the home page.
 *
 * layers   the system stack, top (software) to bottom (hardware); each layer
 *          lists the tools used there and the papers (by id) that change it.
 *          Paper colors follow each paper's `thread` in publications.js.
 *
 * Run `node tools/build.mjs` after editing.
 */
window.RESEARCH = {
  layers: [
    {
      name: 'AI training systems',
      tools: 'PyTorch, DeepSpeed, Megatron-LM, gsplat',
      papers: ['replayopt', 'reflow'],
      ongoing: [
        { name: 'MoE training', thread: 'training' },
        { name: '3DGS training', thread: 'training' }
      ]
    },
    {
      name: 'CPU SIMD kernels',
      tools: 'C++, OpenMP, AVX2, AVX-512',
      papers: ['replayopt', 'reflow']
    },
    {
      name: 'GPU driver & UVM runtime',
      tools: 'NVIDIA open-source GPU driver, CUDA',
      papers: ['safe', 'ariadne']
    },
    {
      name: 'GPU microarchitecture',
      tools: 'Accel-Sim',
      papers: ['reclaimx']
    },
    {
      name: 'Full-system simulation',
      tools: 'gem5, Linux network driver',
      papers: ['pnet-gem5']
    }
  ]
};
