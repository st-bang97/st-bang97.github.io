window.PUBLICATIONS = [
  {
    id: 'reclaimx',
    year: 2026,
    selected: true,
    venueShort: 'MICRO 2026',
    venue: 'IEEE/ACM International Symposium on Microarchitecture (MICRO)',
    title: 'ReclaimX: Device-Side Memory Reclamation via Stalled GPU Execution for UVM Oversubscription',
    authors: ['Seongtae Bang', 'Hyunkyun Shin', 'Hyungwon Park', 'Minho Kim', 'Daehoon Kim'],
    note: 'First author',
    tags: ['GPU Systems', 'UVM', 'Memory Management'],
    summary: 'A GPU-resident memory-management architecture that uses fault-stalled execution resources to reclaim memory during UVM oversubscription.',
    links: {
      project: 'https://caslab-yonsei.github.io/publications/micro26-sbang/'
    }
  },
  {
    id: 'replayopt',
    year: 2026,
    selected: true,
    venueShort: 'IEEE CAL 2026',
    venue: 'IEEE Computer Architecture Letters',
    title: 'ReplayOpt: Optimizer-State Replay to Resolve Critical-Path Bottlenecks in Offloaded Training',
    authors: ['Seongtae Bang', 'Gyeongseo Park', 'Kyeonghyeon Ryu', 'Daehoon Kim'],
    note: 'First author',
    tags: ['LLM Training', 'CPU Offload', 'Heterogeneous Systems'],
    summary: 'An optimizer scheduling technique for CPU-offloaded LLM training that removes optimizer-state writeback from the training critical path.',
    links: {
      doi: 'https://doi.org/10.1109/LCA.2026.3676470',
      project: 'https://caslab-yonsei.github.io/publications/cal26-sbang/'
    }
  },
  {
    id: 'ariadne',
    year: 2026,
    selected: true,
    venueShort: 'HPCA 2026',
    venue: 'IEEE International Symposium on High-Performance Computer Architecture (HPCA)',
    title: 'ARIADNE: Adaptive UVM Management for Efficient GPU Memory Oversubscription',
    authors: ['Hyunkyun Shin', 'Seongtae Bang', 'Hyungwon Park', 'Daehoon Kim'],
    tags: ['GPU Systems', 'UVM', 'Memory Oversubscription'],
    summary: 'Adaptive GPU UVM management for reducing page-fault and migration overheads under memory oversubscription.',
    links: {
      doi: 'https://doi.org/10.1109/HPCA68181.2026.11408564',
      project: 'https://caslab-yonsei.github.io/publications/hpca26-hshin/'
    }
  },
  {
    id: 'pnet-gem5',
    year: 2025,
    selected: false,
    venueShort: 'IEEE CAL 2025',
    venue: 'IEEE Computer Architecture Letters',
    title: 'pNet-gem5: Full-System Simulation with High-Performance Networking Enabled by Parallel Network Packet Processing',
    authors: ['Jongmin Shin', 'Seongtae Bang', 'Gyeongseo Park', 'Daehoon Kim'],
    tags: ['Simulation', 'gem5', 'Networking'],
    summary: 'A full-system gem5 framework for multi-queue, parallel packet processing and realistic high-performance networking studies.',
    links: {
      doi: 'https://doi.org/10.1109/LCA.2025.3577232',
      project: 'https://caslab-yonsei.github.io/publications/cal25-jshin/'
    }
  },
  {
    id: 'safe',
    year: 2025,
    selected: false,
    venueShort: 'IEEE CAL 2025',
    venue: 'IEEE Computer Architecture Letters',
    title: 'SAFE: Sharing-aware Prefetching for Efficient GPU Memory Management with Unified Virtual Memory',
    authors: ['Hyunkyun Shin', 'Seongtae Bang', 'Hyungwon Park', 'Daehoon Kim'],
    note: 'Co-first author',
    tags: ['GPU Systems', 'UVM', 'Prefetching'],
    summary: 'A sharing-aware UVM prefetching mechanism that adapts prefetch behavior to GPU memory-block sharing patterns.',
    links: {
      doi: 'https://doi.org/10.1109/LCA.2025.3553143',
      project: 'https://caslab-yonsei.github.io/publications/cal25-hshin/'
    }
  }
];
