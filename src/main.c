#include <stdio.h>
#include <main.h>

int main(int argc, char *argv[]) {
  GtkApplication *app;
  int status;

  app = gtk_application_new("com.gnome.MyApp", G_APPLICATION_DEFAULT_FLAGS);
  Appdata *data = g_new0(Appdata, 1);
  g_signal_connect(app,"activate", G_CALLBACK(app_activate), data);
  status = g_application_run(G_APPLICATION(app), argc, argv);

  g_object_unref(app);
  return status;
}
