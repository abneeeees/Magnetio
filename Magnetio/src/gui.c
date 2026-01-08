#include <SDL3/SDL.h>
#include <stdbool.h>

SDL_Window *Main_window ;
SDL_Renderer *renderer;

int init(void) {
    if (SDL_Init(SDL_INIT_VIDEO) < 0){
        SDL_LogError(SDL_LOG_CATEGORY_ERROR, "could not create a window: %s\n", SDL_GetError() );
        return 1;
    }
    return 0;
}

int create_display() {
    SDL_DisplayID display = SDL_GetPrimaryDisplay();
    const SDL_DisplayMode *dm = SDL_GetCurrentDisplayMode(display);
    int ScreenWidth = dm->w;
    int ScreenHeight = dm->h;

    Main_window = SDL_CreateWindow("Magnetio",
        ScreenWidth/2,
        ScreenHeight/2,
        SDL_WINDOW_RESIZABLE 
    );
    
    if(Main_window == NULL ){
        SDL_Log( "Window could not be created! SDL error: %s\n", SDL_GetError() );
        return 1;
    }
    return 0;
}

int render(){
    const char *driver ;
    driver = SDL_GetRenderDriver(2);
    
    renderer = SDL_CreateRenderer(
        Main_window,
        driver
    );

    if (!renderer) {
        SDL_Log("Renderer creation failed: %s", SDL_GetError());
        return 1;
    }

    SDL_Event e;
    bool quit = false;
    while (!quit){
        while (SDL_PollEvent(&e)){
            if (e.type == SDL_EVENT_QUIT){
                quit = true;    
            }
        }
        
        SDL_SetRenderDrawColor(renderer, 25, 25, 25, 255);
        SDL_RenderClear(renderer);
        SDL_RenderPresent(renderer);  

        SDL_Delay(10);
    }

    return 0;
}

void destroy_all(void){
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(Main_window);
    SDL_Quit();
}

int main(int argc, char *argv[]){

    init();
    create_display();
    render();
    destroy_all();
    return 0;
}
