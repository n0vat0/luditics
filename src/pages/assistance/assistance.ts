//Componentes de Ionic
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, LoadingController} from "ionic-angular";
import { isNil } from "lodash";

//Importación de provider
import { AssistanceProvider } from "../../providers/assistance/assistance";

import { Assistance } from "../../models/Assistance";

@IonicPage()
@Component({
  selector: "page-assistance",
  templateUrl: "assistance.html"
})
export class AssistancePage {
  list: Assistance[][] = [];
  assistance: Assistance;
  formatDate: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private assistanceProvider: AssistanceProvider,
    private loadingCtrl : LoadingController,
    private toastCtrl : ToastController
  ) {

    var loading = this.loadingCtrl.create({
      content: "Cargando Asistencia..."
    });
    loading.present();

    let date = new Date().toLocaleDateString().split("/");
    this.formatDate = date[2] + "-" + date[1] + "-" + date[0];
    this.assistanceProvider.getAssistances(2, this.formatDate).subscribe(
      data => {
        this.list = this.sortStudentsByIndex(data.entity);
        this.list.forEach(fila => {
          fila.forEach(element => {
            if (element.asistencia == 1) element.asistenciaClass = "onTime";
            else if (element.asistencia == 2) element.asistenciaClass = "late";
            else element.asistenciaClass = "miss";
          });
        });
        loading.dismissAll();
      },
      error => {
        loading.dismissAll();
        this.showMessage(
          "Verifique su conexión a internet. No se puede acceder al servidor"
        );
      }
    );
  }

  tapEvent(event, assistance: Assistance) {
    this.assistance = assistance;
    if (assistance.asistencia == 1) {
      assistance.asistencia = 2;
      assistance.asistenciaClass = "late";
    } else if (assistance.asistencia == 2) {
      assistance.asistencia = 1;
      assistance.asistenciaClass = "onTime";
    } else {
      assistance.asistencia = 2;
      assistance.asistenciaClass = "late";
    }
    event.preventDefault();
  }
  pressEvent(event, assistance: Assistance) {
    this.assistance = assistance;
    if (assistance.asistencia == 1) {
      assistance.asistencia = 3;
      assistance.asistenciaClass = "miss";
    } else if (assistance.asistencia == 3) {
      assistance.asistencia = 1;
      assistance.asistenciaClass = "onTime";
    } else {
      assistance.asistencia = 3;
      assistance.asistenciaClass = "miss";
    }
    event.preventDefault();
  }

  sortStudentsByIndex(data: Assistance[]): Assistance[][] {
    return data.reduce<Assistance[][]>((accumulator, assistance, index) => {
      const row = Math.floor(index / 5);
      const column = index % 5;

      if (isNil(accumulator[row])) {
        accumulator[row] = [];
      }

      accumulator[row][column] = assistance;
      return accumulator;
    }, []);
  }

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: "OK"
    });
    toast.present();
  }
}