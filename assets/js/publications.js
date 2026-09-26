/*
 * Publication data: the single source of truth for every paper on the site.
 *
 * After editing, run `node tools/build.mjs` so the HTML also contains the
 * rendered sections (for search engines, link previews, and readers without
 * JavaScript). Browsers re-render from this file anyway, so a forgotten build
 * never shows visitors stale data.
 *
 * Fields
 *   id          anchor on publications.html (#id)
 *   shortTitle  system name used on cards, badges, and the stack diagram
 *   title       full paper title
 *   authors     author list; "Seongtae Bang" is bold, and a First author or
 *               Co-first author badge is added automatically
 *   equal       optional; authors with equal contribution (marked with *)
 *   year        venue year
 *   venue       venue badge text, e.g. "HPCA"
 *   venueShort  short venue label, e.g. "HPCA 2026"
 *   citation    full venue line shown on publications.html
 *   status      "published" or "to-appear"
 *   thread      research thread color: memory | execution | training | arch
 *   tags        keywords shown under the paper
 *   selected    true = figure card in "Publications" on the home page
 *   highlight   true = result card at the top of the home page (needs result)
 *   teaser      one line for home cards
 *   summary     one or two lines for publications.html
 *   keyResult   headline number in one line
 *   result      optional chart: { metric, bars: [{ label, value }] }, values
 *               are speedups over a baseline of 1x
 *   figure      overview figure (SVG, 760x420 viewBox)
 *   details     problem / idea / result shown under "Overview"
 *   links       any of: pdf, doi, code, slides, video, project
 */
window.PUBLICATIONS = [
  {
    id: 'reflow',
    shortTitle: 'ReFlow',
    title: 'ReFlow: Exposing Parallelism in CPU-Offloaded LLM Training via Register-Resident SIMD Fusion and Decoupled Update Scheduling',
    authors: ['Seongtae Bang', 'Gyeongseo Park', 'Ki-Dong Kang', 'Hyunkyun Shin', 'Sungju Kim', 'Daehoon Kim'],
    year: 2027,
    venue: 'ASPLOS',
    venueShort: 'ASPLOS 2027',
    citation: 'ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS), Heraklion, Greece, 2027',
    status: 'to-appear',
    thread: 'execution',
    tags: ['LLM Training', 'CPU Offload', 'SIMD', 'Optimizer'],
    selected: true,
    highlight: true,
    teaser: 'Parallel CPU-offloaded LLM training via SIMD fusion and split-phase updates.',
    summary: 'A CPU-offloaded LLM training framework that restructures the host optimizer path into a traffic-efficient, parallel CPU–GPU pipeline.',
    keyResult: 'Up to 4× training throughput over ZeRO-Infinity',
    result: { metric: 'Training throughput, up to', bars: [{ label: 'vs ZeRO-Infinity', value: 4 }, { label: 'vs SuperOffload', value: 3 }] },
    figure: 'assets/images/papers/reflow-overview.svg',
    figureAlt: 'Overview of ReFlow using CPU-centric BF16 gradients, register-resident FlashOpt, and split-phase Ready and Persist scheduling.',
    details: {
      problem: 'In CPU-offloaded LLM training, the host optimizer sits on the iteration boundary. ReFlow identifies the dominant bottleneck as serialized host-memory traffic from unnecessary tensor materialization, FP32 gradient inflation, and coupling of latency-critical BF16 parameters with FP32 optimizer-state persistence, rather than CPU arithmetic itself.',
      idea: 'ReFlow combines FlashOpt, CPU-Centric Gradient, and Split-Phase Schedule. FlashOpt keeps optimizer intermediates register-resident, CPU-Centric Gradient transfers compact BF16 gradients and promotes them at the point of use, and Split-Phase Schedule generates next-step BF16 parameters first while deferring FP32-state persistence into CPU slack; when clipping is required, only the lightweight Ready path is replayed.',
      result: 'Across B200 and A100 systems, ReFlow achieves up to 4× higher throughput than ZeRO-Infinity and 3× higher throughput than SuperOffload. On 8 B200 GPUs, it reaches 98% of ZeRO-3 throughput at 50B while preserving baseline training semantics under norm clipping.'
    },
    links: {
      project: 'https://caslab-yonsei.github.io/publications/asplos27-sbang/'
    }
  },
  {
    id: 'reclaimx',
    shortTitle: 'ReclaimX',
    title: 'ReclaimX: Device-Side Memory Reclamation via Stalled GPU Execution for UVM Oversubscription',
    authors: ['Seongtae Bang', 'Hyunkyun Shin', 'Hyungwon Park', 'Minho Kim', 'Daehoon Kim'],
    year: 2026,
    venue: 'MICRO',
    venueShort: 'MICRO 2026',
    citation: 'IEEE/ACM International Symposium on Microarchitecture (MICRO), 2026',
    status: 'to-appear',
    thread: 'memory',
    tags: ['GPU Architecture', 'UVM', 'Memory Management', 'Accel-Sim'],
    selected: true,
    highlight: true,
    teaser: 'Device-side memory reclamation for UVM oversubscription.',
    summary: 'A GPU-resident memory-management architecture that uses fault-stalled execution resources to reclaim memory during UVM oversubscription.',
    keyResult: '2.33× geomean speedup over baseline UVM',
    result: { metric: 'Geomean speedup over baseline UVM', bars: [{ label: 'ReclaimX', value: 2.33 }, { label: 'with prefetching', value: 3.61 }] },
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
    shortTitle: 'ReplayOpt',
    title: 'ReplayOpt: Optimizer-State Replay to Resolve Critical-Path Bottlenecks in Offloaded Training',
    authors: ['Seongtae Bang', 'Gyeongseo Park', 'Kyeonghyeon Ryu', 'Daehoon Kim'],
    year: 2026,
    venue: 'IEEE CAL',
    venueShort: 'IEEE CAL 2026',
    citation: 'IEEE Computer Architecture Letters, 2026',
    status: 'published',
    thread: 'execution',
    tags: ['LLM Training', 'CPU Offload', 'Optimizer', 'SIMD'],
    selected: true,
    highlight: false,
    teaser: 'Optimizer scheduling for CPU-offloaded LLM training.',
    summary: 'An optimizer scheduling technique for CPU-offloaded LLM training that removes optimizer-state writeback from the training critical path.',
    keyResult: 'Up to 21.7% shorter training step',
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
    shortTitle: 'ARIADNE',
    title: 'ARIADNE: Adaptive UVM Management for Efficient GPU Memory Oversubscription',
    authors: ['Hyunkyun Shin', 'Seongtae Bang', 'Hyungwon Park', 'Daehoon Kim'],
    year: 2026,
    venue: 'HPCA',
    venueShort: 'HPCA 2026',
    citation: 'IEEE International Symposium on High-Performance Computer Architecture (HPCA), Sydney, Australia, 2026',
    status: 'published',
    thread: 'memory',
    tags: ['GPU Memory', 'NVIDIA GPU Driver', 'UVM', 'Oversubscription'],
    selected: true,
    highlight: true,
    teaser: 'Adaptive UVM management under memory oversubscription.',
    summary: 'A runtime UVM management framework that adapts fault handling and memory placement to runtime sharing behavior under memory oversubscription.',
    keyResult: '5.0× average speedup at 175% oversubscription',
    result: { metric: 'Average speedup over prior state of the art', bars: [{ label: '130% oversub.', value: 1.9 }, { label: '175% oversub.', value: 5 }, { label: '300% oversub.', value: 4.8 }] },
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
    shortTitle: 'pNet-gem5',
    title: 'pNet-gem5: Full-System Simulation with High-Performance Networking Enabled by Parallel Network Packet Processing',
    authors: ['Jongmin Shin', 'Seongtae Bang', 'Gyeongseo Park', 'Daehoon Kim'],
    year: 2025,
    venue: 'IEEE CAL',
    venueShort: 'IEEE CAL 2025',
    citation: 'IEEE Computer Architecture Letters, vol. 24, no. 2, pp. 193–196, 2025',
    status: 'published',
    thread: 'arch',
    tags: ['gem5', 'Full-System Simulation', 'High-Performance Networking', 'Linux Driver'],
    selected: false,
    highlight: false,
    teaser: 'Full-system simulation with high-performance networking.',
    summary: 'A full-system gem5 framework for multi-queue, parallel packet processing and realistic high-performance networking studies, with public source code and execution examples.',
    keyResult: 'Simulated networking up to 46 Gbps',
    figure: 'assets/images/papers/pnet-gem5-overview.svg',
    figureAlt: 'Overview of pNet-gem5 with a multi-queue NIC, MSI interrupts, and parallel packet processing across simulated CPU cores.',
    details: {
      problem: 'Conventional gem5 networking models do not represent modern multi-queue NICs and parallel kernel packet processing well enough for tens-of-Gbps data-center architecture studies.',
      idea: 'pNet-gem5 adds multiple hardware queues, MSI-based per-queue interrupts, a scalable network interface and driver, and configurable packet distribution so multiple simulated CPU cores can process network traffic in parallel.',
      result: 'The framework scales simulated networking bandwidth up to 46 Gbps, substantially beyond the few-Gbps range of prior gem5 networking models.'
    },
    links: {
      doi: 'https://doi.org/10.1109/LCA.2025.3577232',
      code: 'https://github.com/caslab-yonsei/pNet-gem5',
      project: 'https://caslab-yonsei.github.io/publications/cal25-jshin/'
    }
  },
  {
    id: 'safe',
    shortTitle: 'SAFE',
    title: 'SAFE: Sharing-aware Prefetching for Efficient GPU Memory Management with Unified Virtual Memory',
    authors: ['Hyunkyun Shin', 'Seongtae Bang', 'Hyungwon Park', 'Daehoon Kim'],
    equal: ['Hyunkyun Shin', 'Seongtae Bang'],
    year: 2025,
    venue: 'IEEE CAL',
    venueShort: 'IEEE CAL 2025',
    citation: 'IEEE Computer Architecture Letters, vol. 24, no. 1, pp. 117–120, 2025',
    status: 'published',
    thread: 'memory',
    tags: ['GPU Memory', 'NVIDIA GPU Driver', 'UVM', 'Prefetching'],
    selected: false,
    highlight: false,
    teaser: 'Sharing-aware UVM prefetching.',
    summary: 'A sharing-aware UVM prefetching mechanism that adapts prefetch behavior to GPU memory-block sharing patterns.',
    keyResult: 'Up to 6.5× over the default UVM prefetcher',
    result: { metric: 'Speedup over the default UVM prefetcher', bars: [{ label: 'average', value: 3.6 }, { label: 'best case', value: 6.5 }] },
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
