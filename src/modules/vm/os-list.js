const ON_LOCALHOST = false
const host = 'http://localhost:3000/'

export default [
  {
      id: "archlinux",
      name: "Arch Linux",
      memory_size: 512 * 1024 * 1024,
      vga_memory_size: 8 * 1024 * 1024,
      state: {
          "url": host + "arch_state.bin.zst",
      },
      filesystem: {
          "baseurl": host + "arch/",
      },
  },
  {
      id: "archlinux-boot",
      name: "Arch Linux",
      memory_size: 512 * 1024 * 1024,
      vga_memory_size: 8 * 1024 * 1024,
      filesystem: {
          "baseurl": host + "arch/",
          "basefs": { url: host + "fs.json", },
      },
      cmdline: [
          "rw apm=off vga=0x344 video=vesafb:ypan,vremap:8",
          "root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose",
          "mitigations=off audit=0",
          "page_poison=on",
          "tsc=reliable",
          "random.trust_cpu=on",
          "nowatchdog",
          "init=/usr/bin/init-openrc net.ifnames=0 biosdevname=0",
      ].join(" "),
      bzimage_initrd_from_filesystem: true,
  },
  {
      id: "serenity",
      name: "SerenityOS",
      hda: {
          "url": host + "serenity.img",
          "async": true,
          "size": 876 * 1024 * 1024,
          use_parts: !ON_LOCALHOST,
      },
      memory_size: 512 * 1024 * 1024,
      state: { url: host + "serenity_state-v2.bin.zst", },
      homepage: "https://serenityos.org/",
  },
  {
      id: "serenity-boot",
      name: "SerenityOS",
      hda: {
          "url": host + "serenity.img",
          "async": true,
          "size": 876 * 1024 * 1024,
          use_parts: !ON_LOCALHOST,
      },
      memory_size: 512 * 1024 * 1024,
      homepage: "https://serenityos.org/",
  },
  {
      id: "helenos",
      memory_size: 256 * 1024 * 1024,
      cdrom: {
          url: host + "HelenOS-0.11.2-ia32.iso",
          size: 25765888,
          async: false,
      },
      name: "HelenOS",
      homepage: "http://www.helenos.org/",
  },
  {
      id: "haiku",
      memory_size: 512 * 1024 * 1024,
      hda: {
          url: host + "haiku-v2.img",
          async: true,
          use_parts: !ON_LOCALHOST,
          size: 1 * 1024 * 1024 * 1024,
      },
      state: {
          url: host + "haiku_state-v2.bin.zst",
      },
      name: "Haiku",
      homepage: "https://www.haiku-os.org/",
  },
  {
      id: "haiku-boot",
      memory_size: 512 * 1024 * 1024,
      hda: {
          url: host + "haiku-v2.img",
          async: true,
          use_parts: !ON_LOCALHOST,
          size: 1 * 1024 * 1024 * 1024,
      },
      name: "Haiku",
      homepage: "https://www.haiku-os.org/",
  },
  {
      id: "msdos",
      hda: {
          "url": host + "msdos.img",
          "size": 8 * 1024 * 1024,
          "async": false,
      },
      boot_order: 0x132,
      name: "MS-DOS",
  },
  {
      id: "freedos",
      fda: {
          "url": host + "freedos722.img",
          "size": 737280,
          "async": false,
      },
      name: "FreeDOS",
  },
  {
      id: "psychdos",
      hda: {
          "url": host + "psychdos.img",
          "size": 549453824,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "PsychDOS",
      homepage: "https://psychoslinux.gitlab.io/DOS/INDEX.HTM",
  },
  {
      id: "oberon",
      hda: {
          "url": host + "oberon.img",
          "size": 24 * 1024 * 1024,
          "async": false,
      },
      name: "Oberon",
  },
  {
      id: "windows1",
      fda: {
          "url": host + "windows101.img",
          "size": 1474560,
          "async": false,
      },
      name: "Windows",
  },
  {
      id: "linux26",
      cdrom: {
          "url": host + "linux.iso",
          "size": 6547456,
          "async": false,
      },
      name: "Linux",
  },
  {
      id: "linux3",
      cdrom: {
          "url": host + "linux3.iso",
          "size": 8624128,
          "async": false,
      },
      name: "Linux",
  },
  {
      id: "linux4",
      cdrom: {
          "url": host + "linux4.iso",
          "size": 7731200,
          "async": false,
      },
      name: "Linux",
      filesystem: {},
  },
  {
      id: "buildroot",
      bzimage: {
          url: host + "buildroot-bzimage.bin",
          size: 5166352,
          async: false,
      },
      name: "Buildroot Linux",
      filesystem: {},
      cmdline: "tsc=reliable mitigations=off random.trust_cpu=on",
  },
  {
      id: "nodeos",
      bzimage: {
          url: host + "nodeos-kernel.bin",
          size: 14452000,
          async: false,
      },
      name: "NodeOS",
      cmdline: "tsc=reliable mitigations=off random.trust_cpu=on",
  },
  {
      id: "dsl",
      memory_size: 256 * 1024 * 1024,
      cdrom: {
          url: host + "dsl-4.11.rc2.iso",
          size: 52824064,
          async: false,
      },
      name: "Damn Small Linux",
      homepage: "http://www.damnsmalllinux.org/",
  },
  {
      id: "minix",
      name: "Minix",
      memory_size: 256 * 1024 * 1024,
      cdrom: {
          url: host + "minix-3.3.0.iso",
          size: 605581312,
          async: true,
          use_parts: !ON_LOCALHOST,
      },
      homepage: "https://www.minix3.org/",
  },
  {
      id: "kolibrios",
      fda: {
          "url": ON_LOCALHOST ?
                  host + "kolibri.img" :
                  "//builds.kolibrios.org/eng/data/data/kolibri.img",
          "size": 1474560,
          "async": false,
      },
      name: "KolibriOS",
      homepage: "https://kolibrios.org/en/",
  },
  {
      id: "kolibrios-fallback",
      fda: {
          "url": host + "kolibri.img",
          "size": 1474560,
          "async": false,
      },
      name: "KolibriOS",
  },
  {
      id: "openbsd",
      hda: {
          "url": host + "openbsd.img",
          async: true,
          use_parts: !ON_LOCALHOST,
          size: 1073741824,
      },
      state: {
          url: host + "openbsd_state.bin.zst",
      },
      memory_size: 256 * 1024 * 1024,
      name: "OpenBSD",
  },
  {
      id: "openbsd-boot",
      hda: {
          url: host + "openbsd.img",
          async: true,
          use_parts: !ON_LOCALHOST,
          size: 1073741824,
      },
      memory_size: 256 * 1024 * 1024,
      name: "OpenBSD",
      //acpi: true, // doesn't seem to work
  },
  {
      id: "netbsd",
      hda: {
          "url": host + "netbsd.img",
          async: true,
          use_parts: !ON_LOCALHOST,
          size: 511000064,
      },
      memory_size: 256 * 1024 * 1024,
      name: "NetBSD",
  },
  {
      id: "solos",
      fda: {
          "url": host + "os8.img",
          "async": false,
          "size": 1474560,
      },
      name: "Sol OS",
      homepage: "http://oby.ro/os/",
  },
  {
      id: "bootchess",
      fda: {
          "url": host + "bootchess.img",
          "async": false,
          "size": 1474560,
      },
      name: "BootChess",
      homepage: "http://www.pouet.net/prod.php?which=64962",
  },
  {
      id: "bootbasic",
      fda: {
          "url": host + "bootbasic.img",
          "async": false,
          "size": 1474560,
      },
      name: "bootBASIC",
      homepage: "https://github.com/nanochess/bootBASIC",
  },
  {
      id: "sectorlisp",
      fda: {
          "url": host + "sectorlisp-friendly.bin",
          "async": false,
          "size": 512,
      },
      name: "SectorLISP",
      homepage: "https://justine.lol/sectorlisp2/",
  },
  {
      id: "sectorforth",
      fda: {
          "url": host + "sectorforth.img",
          "async": false,
          "size": 512,
      },
      name: "sectorforth",
      homepage: "https://github.com/cesarblum/sectorforth",
  },
  {
      id: "floppybird",
      fda: {
          "url": host + "floppybird.img",
          "async": false,
          "size": 1474560,
      },
      name: "Floppy Bird",
      homepage: "http://mihail.co/floppybird",
  },
  {
      id: "windows2000",
      memory_size: 512 * 1024 * 1024,
      hda: {
          "url": host + "windows2k.img",
          "size": 2 * 1024 * 1024 * 1024,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "Windows 2000",
      state: {
          "url": host + "windows2k_state.bin.zst",
      },
      preserve_mac_from_state_image: true,
  },
  {
      id: "windows2000-boot",
      memory_size: 512 * 1024 * 1024,
      hda: {
          "url": host + "windows2k.img",
          "size": 2 * 1024 * 1024 * 1024,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      boot_order: 0x132,
      name: "Windows 2000",
  },
  {
      id: "windows98",
      memory_size: 128 * 1024 * 1024,
      hda: {
          "url": host + "windows98.img",
          "async": true,
          use_parts: !ON_LOCALHOST,
          "size": 300 * 1024 * 1024,
      },
      name: "Windows 98",
      state: {
          "url": host + "windows98_state.bin.zst",
      },
      preserve_mac_from_state_image: true,
  },
  {
      id: "windows98-boot",
      memory_size: 128 * 1024 * 1024,
      hda: {
          "url": host + "windows98.img",
          "async": true,
          use_parts: !ON_LOCALHOST,
          "size": 300 * 1024 * 1024,
      },
      name: "Windows 98",
  },
  {
      id: "windows95",
      memory_size: 32 * 1024 * 1024,
      hda: {
          "url": host + "w95.img",
          "size": 242049024,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "Windows 95",
      state: {
          "url": host + "windows95_state.bin.zst",
      },
  },
  {
      id: "windows95-boot",
      memory_size: 32 * 1024 * 1024,
      hda: {
          "url": host + "w95.img",
          "size": 242049024,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "Windows 95",
  },
  {
      id: "windows30",
      memory_size: 64 * 1024 * 1024,
      cdrom: {
          "url": host + "Win30.iso",
          "async": false,
      },
      name: "Windows 3.0",
  },
  {
      id: "windows31",
      memory_size: 64 * 1024 * 1024,
      hda: {
          "url": host + "win31.img",
          "async": false,
          "size": 34463744,
      },
      name: "Windows 3.1",
  },
  {
      id: "freebsd",
      memory_size: 256 * 1024 * 1024,
      hda: {
          "url": host + "freebsd.img",
          "size": 2147483648,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      state: {
          "url": host + "freebsd_state.bin.zst",
      },
      name: "FreeBSD",
  },
  {
      id: "freebsd-boot",
      memory_size: 256 * 1024 * 1024,
      hda: {
          "url": host + "freebsd.img",
          "size": 2147483648,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "FreeBSD",
  },
  {
      id: "reactos-livecd",
      memory_size: 256 * 1024 * 1024,
      hda: {
          "url": host + "reactos-livecd-0.4.15-dev-73-g03c09c9-x86-gcc-lin-dbg.iso",
          "size": 250609664,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "ReactOS",
      homepage: "https://reactos.org/",
  },
  {
      id: "reactos",
      memory_size: 512 * 1024 * 1024,
      hda: {
          "url": host + "reactos.img",
          "size": 500 * 1024 * 1024,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      state: {
          "url": host + "reactos_state.bin.zst",
      },
      preserve_mac_from_state_image: true,
      name: "ReactOS",
      homepage: "https://reactos.org/",
  },
  {
      id: "reactos-boot",
      memory_size: 512 * 1024 * 1024,
      hda: {
          "url": host + "reactos.img",
          "size": 500 * 1024 * 1024,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "ReactOS",
      homepage: "https://reactos.org/",
  },
  {
      id: "skift",
      cdrom: {
          "url": host + "skift-20200910.iso",
          "size": 64452608,
          "async": false,
      },
      name: "Skift",
      homepage: "https://skiftos.org/",
  },
  {
      id: "snowdrop",
      fda: {
          "url": host + "snowdrop.img",
          "size": 1440 * 1024,
          "async": false,
      },
      name: "Snowdrop",
      homepage: "http://www.sebastianmihai.com/snowdrop/",
  },
  {
      id: "openwrt",
      hda: {
          "url": host + "openwrt-18.06.1-x86-legacy-combined-squashfs.img",
          "size": 19846474,
          "async": false,
      },
      name: "OpenWrt",
  },
  {
      id: "qnx",
      fda: {
          url: host + "qnx-demo-network-4.05.img",
          size: 1474560,
          async: false
      },
      name: "QNX 4.05",
  },
  {
      id: "9front",
      memory_size: 128 * 1024 * 1024,
      hda: {
          url: host + "9front-8963.f84cf1e60427675514fb056cc1723e45da01e043.386.iso",
          size: 477452288,
          async: true,
          use_parts: !ON_LOCALHOST,
      },
      state: {
          "url": host + "9front_state-v2.bin.zst",
      },
      acpi: true,
      name: "9front",
      homepage: "https://9front.org/",
  },
  {
      id: "9front-boot",
      memory_size: 128 * 1024 * 1024,
      hda: {
          url: host + "9front-8963.f84cf1e60427675514fb056cc1723e45da01e043.386.iso",
          size: 477452288,
          async: true,
          use_parts: !ON_LOCALHOST,
      },
      acpi: true,
      name: "9front",
      homepage: "https://9front.org/",
  },
  {
      id: "mobius",
      fda: {
          "url": host + "mobius-fd-release5.img",
          "size": 1474560,
          "async": false,
      },
      name: "Mobius",
  },
  {
      id: "android",
      memory_size: 512 * 1024 * 1024,
      cdrom: {
          "url": host + "android-x86-1.6-r2.iso",
          "size": 54661120,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "Android",
  },
  {
      id: "android4",
      memory_size: 512 * 1024 * 1024,
      cdrom: {
          "url": host + "android_x86_nonsse3_4.4r1_20140904.iso",
          "size": 247463936,
          "async": true,
          use_parts: !ON_LOCALHOST,
      },
      name: "Android",
  },
  {
      id: "tinycore",
      memory_size: 256 * 1024 * 1024,
      hda: {
          "url": host + "TinyCore-11.0.iso",
          "async": false,
      },
      name: "Tinycore",
      homepage: "http://www.tinycorelinux.net/",
  },
  {
      id: "freenos",
      memory_size: 256 * 1024 * 1024,
      cdrom: {
          "url": host + "FreeNOS-1.0.3.iso",
          "async": false,
          "size": 11014144,
      },
      name: "FreeNOS",
      acpi: true,
      homepage: "http://www.freenos.org/",
  }
]
