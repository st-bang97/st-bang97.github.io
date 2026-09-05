window.PUBLICATIONS = [
  {
    id: 'reclaimx',
    homeTitle: 'ReclaimX',
    homeSummary: 'Device-side memory management for UVM oversubscription',
    year: 2026,
    selected: true,
    venueBadge: 'MICRO',
    venueShort: 'MICRO 2026',
    venue: 'IEEE/ACM International Symposium on Microarchitecture (MICRO)',
    status: 'Accepted to MICRO 2026',
    title: 'ReclaimX: Device-Side Memory Reclamation via Stalled GPU Execution for UVM Oversubscription',
    authors: ['Seongtae Bang', 'Hyunkyun Shin', 'Hyungwon Park', 'Minho Kim', 'Daehoon Kim'],
    note: 'First author',
    tags: ['GPU Architecture', 'UVM', 'Memory Management', 'Accel-Sim'],
    summary: 'A GPU-resident memory-management architecture that uses fault-stalled execution resources to reclaim memory during UVM oversubscription.',
    figure: 'assets/images/papers/reclaimx-overview.svg',
    figureAlt: 'Overview of ReclaimX device-side memory reclamation during a UVM far-page fault.',
    details: {
      problem: 'Under UVM oversubscription, a far-page fault both requires HBM capacity relief and stalls the faulting GPU execution resources while host-driven recovery proceeds.',
      idea: 'ReclaimX reuses fault-stalled TPCs for fine-grained device-side reclamation. It combines 64 KB victim ordering, selective compressed-resident retention, and local GPU restore so that selected host-mediated migrations become on-device restores.',
      result: 'Across 12 oversubscribed workloads, ReclaimX achieves a 2.33× geometric-mean speedup over baseline UVM. With prefetch-integrated configurations, it reduces far-page faults by 90.6% and reaches up to 3.61× geometric-mean speedup.'
    },
    links: {
      project: 'https://caslab-yonsei.github.io/publications/micro26-sbang/'
    }
  },
  {
    id: 'replayopt',
    homeTitle: 'ReplayOpt',
    homeSummary: 'Optimizer scheduling for CPU-offloaded LLM training',
    year: 2026,
    selected: true,
    venueBadge: 'IEEE CAL',
    venueShort: 'IEEE Computer Architecture Letters (CAL), 2026',
    venue: 'IEEE Computer Architecture Letters (CAL)',
    status: 'Accepted for publication in IEEE Computer Architecture Letters (CAL)',
    title: 'ReplayOpt: Optimizer-State Replay to Resolve Critical-Path Bottlenecks in Offloaded Training',
    authors: ['Seongtae Bang', 'Gyeongseo Park', 'Kyeonghyeon Ryu', 'Daehoon Kim'],
    note: 'First author',
    tags: ['LLM Training', 'CPU Offload', 'Optimizer', 'SIMD'],
    summary: 'An optimizer scheduling technique for CPU-offloaded LLM training that removes optimizer-state writeback from the training critical path.',
    figure: 'assets/images/papers/replayopt-overview.svg',
    figureAlt: 'Overview of ReplayOpt dispatching next-iteration low-precision parameters before replaying deferred high-precision optimizer state.',
    details: {
      problem: 'CPU-offloaded training is often limited by CPU-side optimizer work at the iteration boundary, particularly synchronous persistence of high-precision optimizer state in host memory.',
      idea: 'ReplayOpt splits the optimizer into dispatch and replay. Dispatch produces and transfers the next-iteration low-precision parameters first, allowing GPU execution to resume, while replay reconstructs and persists deferred FP32 state during the following GPU-compute interval.',
      result: 'ReplayOpt reduces CPU-side optimizer time by up to 55.2% and end-to-end step time by up to 21.7% without accuracy loss.'
    },
    links: {
      doi: 'https://doi.org/10.1109/LCA.2026.3676470',
      project: 'https://caslab-yonsei.github.io/publications/cal26-sbang/'
    }
  },
  {
    id: 'ariadne',
    homeTitle: 'ARIADNE',
    homeSummary: 'Adaptive UVM management under memory oversubscription',
    year: 2026,
    selected: true,
    venueBadge: 'HPCA',
    venueShort: 'HPCA 2026',
    venue: 'IEEE International Symposium on High-Performance Computer Architecture (HPCA)',
    status: 'Accepted to HPCA 2026',
    title: 'ARIADNE: Adaptive UVM Management for Efficient GPU Memory Oversubscription',
    authors: ['Hyunkyun Shin', 'Seongtae Bang', 'Hyungwon Park', 'Daehoon Kim'],
    tags: ['GPU Memory', 'NVIDIA GPU Driver', 'UVM', 'Oversubscription'],
    summary: 'A runtime UVM management framework that adapts fault handling and memory placement to runtime sharing behavior under memory oversubscription.',
    figure: 'assets/images/papers/ariadne-overview.svg',
    figureAlt: 'Overview of ARIADNE using pipelined fault handling, sharing degree, and adaptive GPU-memory versus zero-copy placement.',
    details: {
      problem: 'UVM performance degrades sharply under high memory pressure because page-fault latency, page migration, and thrashing interact poorly with static placement and prefetching decisions.',
      idea: 'ARIADNE combines pipelined fault handling, a runtime Sharing Degree metric for thread-level locality, and dynamic placement between GPU memory and Zero-copy. The design is implemented in NVIDIA\'s open-source GPU driver through its UVM subsystem.',
      result: 'ARIADNE reports average speedups of 1.9×, 5.0×, and 4.8× over a state-of-the-art method at 130%, 175%, and 300% memory oversubscription, respectively.'
    },
    links: {
      doi: 'https://doi.org/10.1109/HPCA68181.2026.11408564',
      code: 'https://zenodo.org/records/17852674',
      project: 'https://caslab-yonsei.github.io/publications/hpca26-hshin/'
    }
  },
  {
    id: 'pnet-gem5',
    homeTitle: 'pNet-gem5',
    homeSummary: 'Full-system simulation with high-performance networking',
    year: 2025,
    selected: false,
    venueBadge: 'IEEE CAL',
    venueShort: 'IEEE Computer Architecture Letters (CAL), 2025',
    venue: 'IEEE Computer Architecture Letters (CAL)',
    status: 'Accepted for publication in IEEE Computer Architecture Letters (CAL)',
    title: 'pNet-gem5: Full-System Simulation with High-Performance Networking Enabled by Parallel Network Packet Processing',
    authors: ['Jongmin Shin', 'Seongtae Bang', 'Gyeongseo Park', 'Daehoon Kim'],
    tags: ['gem5', 'Full-System Simulation', 'High-Performance Networking', 'Linux Driver'],
    summary: 'A full-system gem5 framework for multi-queue, parallel packet processing and realistic high-performance networking studies, with public source code and execution examples.',
    figure: 'assets/images/papers/pnet-gem5-overview.svg',
    figureAlt: 'Overview of pNet-gem5 with a multi-queue NIC, MSI interrupts, and parallel packet processing across simulated CPU cores.',
    details: {
      problem: 'Conventional gem5 networking models do not represent modern multi-queue NICs and parallel kernel packet processing well enough for tens-of-Gbps data-center architecture studies.',
      idea: 'pNet-gem5 adds multiple hardware queues, MSI-based per-queue interrupts, a scalable network interface and driver, and configurable packet distribution so multiple simulated CPU cores can process network traffic in parallel.',
      result: 'The framework scales simulated networking bandwidth up to 46 Gbps, substantially beyond the few-Gbps range of prior gem5 networking models.'
    },
    links: {
      doi: 'https://doi.org/10.1109/LCA.2025.3577232',
      codeExamples: 'https://github.com/caslab-yonsei/pNet-gem5',
      project: 'https://caslab-yonsei.github.io/publications/cal25-jshin/'
    }
  },
  {
    id: 'safe',
    homeTitle: 'SAFE',
    homeSummary: 'Sharing-aware UVM prefetching',
    year: 2025,
    selected: true,
    venueBadge: 'IEEE CAL',
    venueShort: 'IEEE Computer Architecture Letters (CAL), 2025',
    venue: 'IEEE Computer Architecture Letters (CAL)',
    status: 'Accepted for publication in IEEE Computer Architecture Letters (CAL)',
    title: 'SAFE: Sharing-aware Prefetching for Efficient GPU Memory Management with Unified Virtual Memory',
    authors: ['Hyunkyun Shin', 'Seongtae Bang', 'Hyungwon Park', 'Daehoon Kim'],
    note: 'Co-first author',
    tags: ['GPU Memory', 'NVIDIA GPU Driver', 'UVM', 'Prefetching'],
    summary: 'A sharing-aware UVM prefetching mechanism that adapts prefetch behavior to GPU memory-block sharing patterns.',
    figure: 'assets/images/papers/safe-overview.svg',
    figureAlt: 'Overview of SAFE tracking memory-block sharing behavior and adapting UVM prefetch aggressiveness.',
    details: {
      problem: 'A fixed UVM prefetching policy can help regular workloads but waste bandwidth and capacity on irregular or dynamically changing access patterns.',
      idea: 'SAFE observes how memory blocks are shared across GPU SMs and uses that sharing behavior to adjust prefetching aggressiveness at runtime. It extends NVIDIA\'s open-source GPU driver through the UVM subsystem without requiring additional hardware.',
      result: 'SAFE achieves up to 6.5× speedup over the default UVM prefetcher on predominantly irregular workloads, with a 3.6× average improvement in the reported evaluation.'
    },
    links: {
      doi: 'https://doi.org/10.1109/LCA.2025.3553143',
      project: 'https://caslab-yonsei.github.io/publications/cal25-hshin/'
    }
  }
];