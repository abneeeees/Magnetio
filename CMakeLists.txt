cmake_minimum_required(VERSION 4.2.1)
project(Magnetio VERSION 1.0.0 LANGUAGES C)

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Wextra -Wpedantic")
// add_compile_options(-Wall -Wextra -Wpedantic) //Modern Alternative for the above line of code

find_package(PkgConfig REQUIRED)
pkg_check_modules(GTK4 REQUIRED IMPORTED_TARGET gtk4)

add_executable(Magnetio
    src/main.c
    src/gui.c
    src/magnet.c
)

target_include_directories(Magnetio PRIVATE
    ${CMAKE_SOURCE_DIR}/include
)

target_link_libraries(Magnetio PRIVATE PkgConfig::GTK4)