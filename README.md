## Magnetio
 - Magnetio is a streaming, downloading and playing platform for magnet links.
 - Its a minimal version inspired by [stremio](https://www.stremio.com/)
  
---

### Features
 - It allows users to 
   - Stream videos using magnet links.
   - Download media using magnet links.
   - Search for magent links of desired choice.

### Project Structure
```bash
├── CMakeLists.txt
├── include
│   ├── gui.h
│   ├── magnet.h
│   └── main.h
├── README.md
└── src
    ├── gui
    ├── gui.c
    ├── magnet.c
    └── main.c

```
### Building & Running
- `gtk` Graphics, input and audio
- `cmake` Module for building C/C++ Code.

### Cloning & Building
```bash
git clone https://github.com/abneeeees/Magnetio
cd Magnetio
mkdir build && cd build
cmake ..
make or make all
```

### Running
```bash

```