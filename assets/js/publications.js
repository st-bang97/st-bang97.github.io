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
 *   figure      key-idea figure (SVG, 760x420 viewBox), also the card image
 *   mechanism   how-it-works figure (SVG, 760x420), shown in the Overview window
 *   details     prior / insight / approach / result shown in the Overview window
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
    teaser: 'Prior systems hide the slow CPU update; ReFlow removes its real cause, host-memory traffic.',
    summary: 'Prior CPU-offloaded training treats the host optimizer as slow compute and hides it. ReFlow shows the delay comes from host-memory traffic and removes it, reaching GPU-resident speed while the optimizer stays fully offloaded.',
    keyResult: 'Up to 4× training throughput over ZeRO-Infinity',
    result: { metric: 'Training throughput, up to', bars: [{ label: 'vs ZeRO-Infinity', value: 4 }, { label: 'vs SuperOffload', value: 3 }] },
    figure: 'assets/images/papers/reflow-overview.svg',
    figureAlt: 'Key insight: the host optimizer update in CPU-offloaded training is slow because of memory traffic, not CPU math. Prior systems hide the delay by moving work to the GPU or speculating; ReFlow removes the traffic, keeps the optimizer fully offloaded, keeps training identical, and matches GPU-resident ZeRO-3 throughput.',
    mechanism: 'assets/images/papers/reflow-mechanism.svg',
    mechanismAlt: 'Timeline comparison of ZeRO-Infinity and ReFlow. In ZeRO-Infinity the GPU idles while the CPU runs a serialized optimizer update; in ReFlow the update overlaps the backward pass and FP32 state is persisted during the next forward pass.',
    details: {
      prior: 'CPU offloading frees GPU memory, but the GPU then waits for the CPU optimizer every step. Prior systems assume the CPU is simply slow, so they hide the delay: they move work back to the GPU, which costs GPU memory, or speculate and roll back, which can change the training result.',
      insight: 'The CPU is not slow at the math. Adam arithmetic is only about 16% of the host update; the rest is memory traffic from writing intermediates to DRAM, inflating gradients to FP32, and making the parameters the GPU needs wait behind the FP32 state write-back.',
      approach: 'Instead of hiding the host path, ReFlow fixes it. Intermediates stay in CPU registers, gradients cross PCIe in compact BF16, and the parameters the GPU needs next are produced first while the FP32 state is written later, off the critical path.',
      result: 'The optimizer stays fully offloaded and training stays identical, yet throughput matches GPU-resident ZeRO-3 (681 vs. 682 TFLOPS per GPU on OPT-30B with 4 B200 GPUs): up to 4× ZeRO-Infinity and 3× SuperOffload, with models up to 95B on 8 B200 GPUs.',
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
    teaser: 'A page fault stalls a GPU core anyway, so ReclaimX lets that stalled core free GPU memory.',
    summary: 'Prior UVM work frees GPU memory from the host after a fault has stalled the GPU. ReclaimX lets the stalled GPU cores do the reclamation themselves: earlier, at finer granularity, and without taking compute from running work.',
    keyResult: '2.33× geomean speedup over baseline UVM',
    result: { metric: 'Geomean speedup over baseline UVM', bars: [{ label: 'ReclaimX', value: 2.33 }, { label: 'with prefetching', value: 3.61 }] },
    figure: 'assets/images/papers/reclaimx-overview.svg',
    figureAlt: 'Key insight: a far-page fault both signals that GPU memory must be freed and stalls a GPU core. Prior UVM work frees memory from the host at 2 MB granularity; ReclaimX lets the stalled core reclaim 64 KB blocks on the device, keeps cold data compressed in HBM, and uses only compute that was idle anyway.',
    mechanism: 'assets/images/papers/reclaimx-mechanism.svg',
    mechanismAlt: 'Side-by-side comparison. In baseline UVM a far-page fault stalls a TPC while the host driver picks victims at 2 MB granularity; in ReclaimX the stalled TPC compresses a cold 64 KB block inside HBM or evicts it, and later accesses are restored locally on the GPU.',
    details: {
      prior: 'Under UVM oversubscription, prior work prefetches to fault less, overlaps eviction, throttles active cores, or compresses memory in fixed hardware. In every case, freeing GPU memory still starts on the host after the fault, picks victims at coarse 2 MB granularity, and leaves the faulting core idle.',
      insight: 'A far-page fault reveals two things at once: HBM capacity must be freed, and a TPC has just stalled with nothing to do. The event that creates the need for memory relief also creates the idle compute to provide it.',
      approach: 'ReclaimX turns fault-stalled TPCs into memory reclaimers. Relief starts on the device immediately, at the 64 KB granularity of the demand; cold, compressible blocks stay compressed inside HBM and are restored locally instead of round-tripping through the host. No compute is reserved and no running core is throttled.',
      result: '2.33× geomean speedup over baseline UVM across 12 workloads, and up to 3.61× with state-of-the-art prefetchers with 90.6% fewer far-page faults. Even an idealized host-controlled version reaches only 90–94% of ReclaimX, showing that running reclamation on the device is what matters.',
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
    citation: 'IEEE Computer Architecture Letters, vol. 25, no. 1, pp. 142–145, 2026',
    status: 'published',
    thread: 'execution',
    tags: ['LLM Training', 'CPU Offload', 'Optimizer', 'SIMD'],
    selected: true,
    highlight: false,
    teaser: 'The GPU needs only the new parameters to continue, so ReplayOpt sends those first and writes the FP32 state later.',
    summary: 'Offloaded optimizers finish the whole update, including the FP32 write-back, before the GPU can continue. ReplayOpt reorders the step by deadline so only the parameters the GPU needs stay on the critical path.',
    keyResult: 'Up to 21.7% shorter training step',
    figure: 'assets/images/papers/replayopt-overview.svg',
    figureAlt: 'Key insight: one optimizer step produces BF16 parameters that the GPU needs immediately and FP32 state that is needed only at the next update. ReplayOpt dispatches the parameters first and replays the FP32 write-back during GPU compute, removing it from the critical path.',
    mechanism: 'assets/images/papers/replayopt-mechanism.svg',
    mechanismAlt: 'Timeline comparison of conventional CPU-offloaded training and ReplayOpt. Conventionally the GPU idles until the CPU finishes the update and FP32 write-back; ReplayOpt dispatches BF16 parameters first and replays the FP32 write-back during the next GPU compute interval.',
    details: {
      prior: 'In CPU-offloaded training, the optimizer runs as one monolithic step at the iteration boundary: it updates the state, persists high-precision FP32 values in host memory, and only then returns parameters to the GPU, which waits for all of it.',
      insight: 'The step\'s two outputs have different deadlines. The GPU needs the low-precision parameters immediately, but the FP32 state is needed only at the next optimizer step, so its write-back has slack.',
      approach: 'ReplayOpt splits the step by deadline: dispatch computes and sends the next-step parameters first so the GPU resumes at once, and replay reconstructs and persists the deferred FP32 state while the GPU computes.',
      result: 'CPU-side optimizer time drops by up to 55.2% and end-to-end step time by up to 21.7%, without accuracy loss. This deadline-aware view later grew into ReFlow.',
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
    teaser: 'Fast UVM under heavy memory oversubscription from the driver alone, with no hardware, compiler, or application changes.',
    summary: 'Prior fixes for UVM oversubscription help little or require hardware and compiler changes. ARIADNE decides at runtime, inside the driver, which regions to migrate and which to read in place, so any existing GPU binary runs fast.',
    keyResult: '5.0× average speedup at 175% oversubscription',
    result: { metric: 'Average speedup over prior state of the art', bars: [{ label: '130% oversub.', value: 1.9 }, { label: '175% oversub.', value: 5 }, { label: '300% oversub.', value: 4.8 }] },
    figure: 'assets/images/papers/ariadne-overview.svg',
    figureAlt: 'Key insight: the UVM driver can measure how widely threads share each memory region at runtime and use it to migrate shared regions and read the rest in place. Unlike prior approaches, ARIADNE needs no hardware or compiler changes, hides migration latency, and avoids thrashing.',
    mechanism: 'assets/images/papers/ariadne-mechanism.svg',
    mechanismAlt: 'Three mechanisms inside NVIDIA’s open-source UVM driver: pipelined fault handling, a runtime Sharing Degree metric, and adaptive placement between GPU memory and zero-copy, with average speedups of 1.9x, 5.0x, and 4.8x at 130%, 175%, and 300% oversubscription.',
    details: {
      prior: 'When data exceeds GPU memory, UVM slows sharply from page-fault overhead and thrashing. Prefetching, access-counter-based migration, and dynamic zero-copy offer limited benefits and often require hardware or compiler changes, giving up the portability that makes UVM attractive.',
      insight: 'The driver can learn each memory region’s thread-level locality at runtime, its Sharing Degree, without any hardware or compiler help, and that is enough to decide whether a region should move to GPU memory or be read in place.',
      approach: 'ARIADNE keeps UVM’s abstraction and changes only the driver: it places each region in GPU memory or zero-copy according to its live sharing behavior and pipelines fault handling to hide migration latency, so even closed-source binaries benefit without recompilation.',
      result: 'Average speedups of 1.9×, 5.0×, and 4.8× over a state-of-the-art method at 130%, 175%, and 300% oversubscription, while preventing thrashing and scaling near-linearly.',
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
    teaser: 'gem5 can now simulate servers the way modern NICs work: many queues, each served by its own core, at up to 46 Gbps.',
    summary: 'Prior gem5 networking models a single-queue NIC limited to a few Gbps, and the DPDK-based alternative covers only userspace networking. pNet-gem5 models multi-queue NICs with per-queue interrupts, so kernel-networked servers can be simulated at tens of Gbps.',
    keyResult: 'Simulated networking up to 46 Gbps',
    figure: 'assets/images/papers/pnet-gem5-overview.svg',
    figureAlt: 'Key insight: to study data-center servers, the simulator must model the parallel packet path real systems use, with one NIC queue and interrupt per core. Unlike gem5 networking, pNet-gem5 models multi-queue NICs with per-queue MSI, supports kernel networking at high bandwidth, and reaches 46 Gbps.',
    mechanism: 'assets/images/papers/pnet-gem5-mechanism.svg',
    mechanismAlt: 'Comparison of the gem5 baseline NIC, which funnels packets through one queue and one core to a few Gbps, with pNet-gem5, which adds four hardware queues with per-queue MSI interrupts so four cores process packets in parallel at up to 46 Gbps.',
    details: {
      prior: 'Data-center servers handle 100 Gigabit Ethernet traffic in parallel with multi-queue NICs, but gem5 lacks these techniques and its outdated networking model reaches only a few Gbps. A recent DPDK-based framework supports userspace networking only, while many applications still use the kernel stack.',
      insight: 'To study data-center servers faithfully, a simulator must reproduce the parallel packet path real systems use: multiple NIC queues, each with its own interrupt and core.',
      approach: 'pNet-gem5 adds multiple hardware queues and Message Signaled Interrupts so each queue maps to a dedicated core, and decouples packet distribution and scheduling from the NIC logic so researchers can plug in their own policies.',
      result: 'Kernel-networked servers can now be simulated at up to 46 Gbps instead of a few Gbps, in line with today’s tens-of-Gbps networks. The source code and execution examples are public.',
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
    teaser: 'How widely a memory block is shared across SMs predicts whether prefetching it pays off; SAFE prefetches accordingly.',
    summary: 'Prior UVM prefetching applies one setting everywhere and struggles with irregular workloads. SAFE uses a signal the GPU already has, how many SMs share each block, to prefetch aggressively only where it pays off.',
    keyResult: 'Up to 6.5× over the default UVM prefetcher',
    result: { metric: 'Speedup over the default UVM prefetcher', bars: [{ label: 'average', value: 3.6 }, { label: 'best case', value: 6.5 }] },
    figure: 'assets/images/papers/safe-overview.svg',
    figureAlt: 'Key insight: how widely a memory block is shared across GPU SMs predicts whether prefetching it pays off. The default UVM prefetcher applies one setting to every block; SAFE chooses a setting per block from sharing status read from existing uTLBs.',
    mechanism: 'assets/images/papers/safe-mechanism.svg',
    mechanismAlt: 'Side-by-side comparison. The default UVM prefetcher applies one rule to every block and over-fetches on irregular access; SAFE tracks how many SMs share each block through uTLBs and prefetches aggressively only for widely shared blocks.',
    details: {
      prior: 'UVM prefetching hides host-memory access costs for regular workloads, but the default prefetcher applies one setting to every block. On irregular and dynamically mixed workloads, prefetched neighbors go unused and waste PCIe bandwidth and GPU memory.',
      insight: 'A workload’s regularity strongly correlates with how its memory blocks are shared among SMs: widely shared blocks are accessed regularly, while blocks touched by few SMs are not. Sharing status therefore predicts whether prefetching will pay off.',
      approach: 'SAFE reads each block’s sharing status from the GPU’s existing unified TLBs and chooses a prefetch setting per block, with no hardware changes and negligible overhead.',
      result: 'Up to 6.5× faster than the default UVM prefetcher on predominantly irregular workloads, and 3.6× faster on average.',
    },
    links: {
      doi: 'https://doi.org/10.1109/LCA.2025.3553143',
      project: 'https://caslab-yonsei.github.io/publications/cal25-hshin/'
    }
  }
];
