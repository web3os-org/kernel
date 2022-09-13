// TODO: Cleanup, sort, and improve consistency

export default {
  common: {
    Yes: 'Ja',
    No: 'Nein',
    Cancel: 'Absagen',
    Help: 'Hilfe',
    Booting: 'Booten',
    Cores: 'Kerne',
    Command: 'Befehl',
    Commands: 'Befehle',
    Arguments: 'Argumente',
    Options: 'Optionen',
    Rebooting: 'Neustart',
    Donate: 'Spenden',
    Host: 'Gastgeber',
    Platform: 'Plattform',
    Battery: 'Batterie',
    Storage: 'Lagerung',
    Usage: 'Verwendungszweck',
    Used: 'Gebraucht',
    Free: 'Frei',
    Type: 'Typ',
    Save: 'Speichern',
    Size: 'Größe',
    Applications: 'Anwendungen',
    Configuration: 'Aufbau',
    Mounts: 'Dateisystem-Mounts',
    invalidFilename: 'Ungültiger Dateiname',
    language: 'Sprache',
    namespace: 'Namensraum',
    or: 'oder',
    ephemeral: 'flüchtig',
    typeVerb: 'Tippen',
    typeNoun: 'Modell',
    printThisHelpMessage: 'Drucken Sie diese Hilfenachricht aus',
    printVersionInformation: 'Drucken Sie die Versionsinformationen',

    'Heap Limit': 'Heap-Grenze',
    'Packages in the': 'Pakete im',
    'Powered by': 'Unterstützt von',
    'A few examples': 'Ein paar Beispiele',
    'Temporary Files': 'Temporäre Dateien',
    'System Data': 'System-Daten',
    'Kernel Data': 'Kernel-Daten'
  },

  kernel: {
    // bootIntroSubtitle: 'Hergestellt mit ♥ von Jay Mathis',
    firstBootWarning: 'Der erste Start dauert am längsten, bitte haben Sie etwas Geduld!',
    mobileExperienceWarning: 'HINWEIS: Das mobile Erlebnis ist ziemlich verrückt und experimentell – gehen Sie mit Vorsicht vor!',
    invalidModule: 'Ungültiges Modul bereitgestellt',
    helpNotExported: 'Aus diesem Modul wird keine Hilfe exportiert',

    bootIntro: {
      help: 'für Hilfe',
      docs: 'um die Dokumentation zu öffnen',
      desktop: 'um den Desktop zu starten',
      wallet: 'um sich mit Ihrer Brieftasche zu verbinden',
      filesBin: 'um alle ausführbaren Befehle zu erkunden',
      install: 'um web3os auf Ihrem Gerät zu installieren',
      lsmod: 'um alle Kernelmodule aufzulisten',
      confetti: 'um die Konfettipistole abzufeuern 🎉',
      minipaint: 'Art™ zu zeichnen 🎨',
      clip: 'um die Ausgabe eines Befehls in die Zwischenablage zu kopieren',
      repl: 'um das interaktive Javascript-Terminal auszuführen'
    },

    bins: {
      descriptions: {
        alert: 'Benachrichtigung anzeigen',
        alias: 'Befehlsaliasnamen festlegen oder auflisten',
        clear: 'Löschen Sie das Terminal',
        clip: 'Rückgabewert des Befehls in die Zwischenablage kopieren',
        date: 'Datum/Uhrzeit anzeigen',
        docs: 'Öffnen Sie die Dokumentation',
        dump: 'Dump den Speicherzustand',
        echo: 'Geben Sie einen Text an das Terminal zurück',
        eval: 'Laden und Auswerten einer Javascript-Datei',
        get: 'Rufen Sie einen Kernel-Speicher-Namespace oder -Schlüssel ab',
        height: 'Körpergröße einstellen',
        history: 'Befehlshistorie anzeigen',
        import: 'Importieren Sie ein Modul von einer URL',
        install: 'Installieren Sie web3os als PWA',
        ipecho: 'Geben Sie Ihre öffentliche IP-Adresse wieder',
        lsmod: 'Geladene Kernel-Module auflisten',
        man: 'Pseudonym der (help)',
        objectUrl: 'Erstellen Sie eine ObjectURL für eine Datei',
        set: 'Legen Sie einen Kernel-Speicherwert fest',
        sh: 'Führen Sie ein web3os-Skript aus',
        storage: 'Informationen zur Speichernutzung anzeigen',
        systemnotify: 'Zeigen Sie eine Browser-/Plattformbenachrichtigung mit z. B. systemnotify Title Body an',
        reboot: 'web3os neu laden',
        restore: 'Stellen Sie den Speicherzustand wieder her',
        snackbar: 'Zeigen Sie eine Snackbar; z.B. snackbar Alarm!',
        unset: 'Angegebenen Speichernamensraum oder Schlüssel löschen',
        wait: 'Warten Sie die angegebene Anzahl von Millisekunden',
        width: 'Körperbreite einstellen'
      }
    },

    fsModules: {
      descriptions: {
        cd: 'Ändern Sie das aktuelle Arbeitsverzeichnis',
        cp: 'Kopieren Sie eine Datei oder ein Verzeichnis',
        cwd: 'Holen Sie sich das aktuelle Arbeitsverzeichnis',
        download: 'URL auf CWD herunterladen oder DATEI auf PC herunterladen',
        ls: 'Verzeichnisinhalte auflisten',
        mkdir: 'Erstellen Sie ein Verzeichnis',
        mv: 'Verschieben Sie eine Datei oder ein Verzeichnis',
        read: 'Lesen Sie den Inhalt der Datei',
        rm: 'Entfernen Sie eine Datei',
        rmdir: 'Entfernen Sie ein Verzeichnis und seinen gesamten Inhalt',
        touch: 'Berühren Sie eine Datei',
        upload: 'Daten hochladen'
      }
    },

    config: {
      descriptions: {
        autostart: 'Wird beim Start zeilenweise ausgeführt',
        packages: 'Meistern Sie die lokale Paketliste'
      }
    }
  }
}
