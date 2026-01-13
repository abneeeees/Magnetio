#include "../include/gui.h"

static GtkWidget* SearchPage(Appdata *data) {
  return gtk_label_new("Search");
}

static GtkWidget* PlayPage(Appdata *data) {
  data->video = gtk_video_new();

  GtkMediaStream *stream;
  stream = gtk_media_file_new_for_filename("file.mp4");

  gtk_video_set_media_stream(GTK_VIDEO(data->video), stream);

  return data->video;
}

static GtkWidget* DownloadPage(Appdata *data) {
  return gtk_label_new("Download");
}

static void Clicked(GtkButton *button, gpointer user_data) {
    Appdata *data = user_data;
    const char *page = gtk_widget_get_name(GTK_WIDGET(button));

    gtk_stack_set_visible_child_name(GTK_STACK(data->stack), page);
}

static void app_activate(GApplication *app, gpointer user_data){
  Appdata *data = user_data;

    // ======= Main Window ======= //c
  data->window = gtk_application_window_new(GTK_APPLICATION(app));
  gtk_window_set_title(GTK_WINDOW(data->window), "Magnetio");

  gtk_window_set_default_size(
      GTK_WINDOW(data->window), 960, 600);

  // ======= Creating Universal Vertical box ======= //
  data->box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 1);

  gtk_window_set_child(GTK_WINDOW(data->window), data->box);

  // ======= Navigation Bar ======= //
  GtkWidget *navbar;
  
  // putting the horizontal GtkBox for the header
  navbar = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 1);
  
  // Appending the header's horizontal Gtkbox inside the main vertical GtkBox
  gtk_box_append(GTK_BOX(data->box),navbar);
  
  GtkWidget *download;
  GtkWidget *play;
  GtkWidget *search;
  
  download = gtk_button_new_with_label("Download");
  play = gtk_button_new_with_label("Play");
  search = gtk_button_new_with_label("Search");

  gtk_widget_set_name(play, "Play");
  gtk_widget_set_name(search, "Search");
  gtk_widget_set_name(download, "Download");

  gtk_box_append(GTK_BOX(navbar), download);
  gtk_box_append(GTK_BOX(navbar), play);
  gtk_box_append(GTK_BOX(navbar), search);
  
  // ======= Pages ======= //
  data->stack = gtk_stack_new();
  gtk_stack_set_transition_type(GTK_STACK(data->stack), GTK_STACK_TRANSITION_TYPE_CROSSFADE);
  gtk_stack_set_transition_duration(GTK_STACK(data->stack), 200);
  
  gtk_box_append(GTK_BOX(data->box), data->stack);
  
  GtkWidget *download_page = DownloadPage(data);
  GtkWidget *play_page = PlayPage(data);
  GtkWidget *search_page = SearchPage(data);
  
  gtk_stack_add_named(GTK_STACK(data->stack), download_page, "Download");
  gtk_stack_add_named(GTK_STACK(data->stack), play_page, "Play");
  gtk_stack_add_named(GTK_STACK(data->stack), search_page, "Search");
  
  gtk_stack_set_visible_child(GTK_STACK(data->stack), search_page);
  
  g_signal_connect(download, "clicked", G_CALLBACK(Clicked), data);
  g_signal_connect(play, "clicked", G_CALLBACK(Clicked), data);
  g_signal_connect(search, "clicked", G_CALLBACK(Clicked), data);
  
  gtk_window_present(GTK_WINDOW(data->window));
}

int main(int argc, char *argv[]){
  GtkApplication *app;
  int status;

  app = gtk_application_new("com.gnome.MyApp", G_APPLICATION_DEFAULT_FLAGS);
  Appdata *data = g_new0(Appdata, 1);
  g_signal_connect(app,"activate", G_CALLBACK(app_activate), data);
  status = g_application_run(G_APPLICATION(app), argc, argv);

  g_object_unref(app);
  return status;
}
