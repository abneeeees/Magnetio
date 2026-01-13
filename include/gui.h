#ifndef GUI_H
#define GUI_h

#include <gtk/gtk.h>

typedef struct {
  GtkWidget *window;
  GtkWidget *box;
  GtkWidget *stack;

  // Play Page
  GtkWidget *video;
} Appdata;

static GtkWidget* DownloadPage(Appdata *data);
static GtkWidget* PlayPage(Appdata *data);
static GtkWidget* SearchPage(Appdata *data);

static void app_activate(GApplication *app, gpointer user_data);
static void Clicked(GtkButton *button, gpointer user_data);

#endif