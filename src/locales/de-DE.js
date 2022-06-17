export default {
  common: {
    Booting: 'Booten',
    command: 'Befehl',
    Rebooting: 'Neustart',
    Donate: 'Spenden',
    Platform: 'Plattform',
    Battery: 'Batterie',
    Storage: 'Lagerung',
    Usage: 'Verwendungszweck',
    Used: 'Gebraucht',
    Free: 'Frei',
    invalidFilename: 'Ungültiger Dateiname',
    Options: 'Optionen',
    language: 'Sprache',
    typeVerb: 'Tippen',
    typeNoun: 'Modell',
    printThisHelpMessage: 'Drucken Sie diese Hilfenachricht aus',
    printVersionInformation: 'Drucken Sie die Versionsinformationen',
    'Heap Limit': 'Heap-Grenze'
  },

  kernel: {
    bootIntroSubtitle: 'Hergestellt mit ♥ von Jay Mathis',
    firstBootWarning: 'Der erste Start dauert am längsten, bitte haben Sie etwas Geduld!',
    mobileExperienceWarning: 'HINWEIS: Das mobile Erlebnis ist ziemlich verrückt und experimentell – gehen Sie mit Vorsicht vor!',
    invalidModule: 'Ungültiges Modul bereitgestellt',
    helpNotExported: 'Aus diesem Modul wird keine Hilfe exportiert',

    bootIntro: {
      help: 'für Hilfe',
      docs: 'um die Dokumentation zu öffnen',
      desktop: 'um den Desktop zu starten',
      account: 'um sich mit Ihrer Brieftasche zu verbinden',
      filesBin: 'um alle ausführbaren Befehle zu erkunden',
      lsmod: 'um alle Kernelmodule aufzulisten',
      confetti: 'um die Konfettipistole abzufeuern 🎉',
      minipaint: 'Art™ zu zeichnen 🎨',
      clip: 'um die Ausgabe eines Befehls in die Zwischenablage zu kopieren'
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
        ipecho: 'Geben Sie Ihre öffentliche IP-Adresse wieder',
        lsmod: 'Geladene Kernel-Module auflisten',
        man: 'Alias der Hilfe',
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

    config: {
      descriptions: {
        autostart: 'Wird beim Start zeilenweise ausgeführt',
        packages: 'Meistern Sie die lokale Paketliste'
      }
    }
  }
}
