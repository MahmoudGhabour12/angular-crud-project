import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { findIndex } from 'lodash-es';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Unit } from 'models/unit.model';
import { UnitService } from 'services/units.service';

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class UnitsListComponent implements OnInit, OnDestroy {
  loading: boolean;
  unitDialog: boolean;
  displayDeleteDialog: boolean;
  units: Unit[];
  unit: Unit;
  selectedUnits: Unit[];
  submitted: boolean;
  totalRecords: number;

  /**
   * The set of subscriptions on this components,
   * these subscriptions must be unsubscribed before this component got destroyed.
   */
  subscriptions = new Subscription();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private unitService: UnitService
  ) {}

  ngOnInit() {
    this.loading = true;

    /**
     * Get the System units.
     */
    this.subscriptions.add(
      this.unitService
        .getUnits()

        .subscribe((units) => {
          this.units = units;
          this.totalRecords = units.length;
          this.loading = false;
        })
    );
  }

  /**
   * Destroy component data
   */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Add new unit.
   */
  addUnit() {
    this.unit = {};
    this.submitted = false;
    this.unitDialog = true;
  }

  /**
   * Delete the current selected units.
   */
  deleteSelectedUnits() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.confirmDeleteSelectedProducts(this.selectedUnits);
      },
    });
  }

  editUnit(unit: Unit) {
    this.unit = { ...unit };
    this.unitDialog = true;
  }

  /**
   * Delete the selected unit.
   */
  deleteUnit(unit: Unit) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${unit.arabicName} ?`,
      header: 'Confirm delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.confirmDelete(unit.id);
        this.unit = {};
      },
    });
  }

  /**
   * Confirm the Delete action.
   */
  confirmDelete(id: number) {
    this.subscriptions.add(
      this.unitService
        .delete(id)

        .subscribe((response) => {
          this.units = this.units.filter((unit) => unit.id !== id);

          this.messageService.add({
            severity: 'warn',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 4000,
          });
        })
    );
  }

  /**
   * Confirm the Delete selected products action.
   */
  confirmDeleteSelectedProducts(units: Unit[]) {
    this.subscriptions.add(
      this.unitService
        .deleteSelectedProducts(units.map((unit) => unit.id))

        .subscribe((response) => {
          this.units = this.units.filter((unit) => !response.data.includes(unit.id));

          this.messageService.add({
            severity: 'warn',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 4000,
          });
          this.selectedUnits = null;
        })
    );
  }

  hideDialog() {
    this.unitDialog = false;
    this.submitted = false;
  }

  /**
   * Function to add unit or to edit the current unit.
   */
  saveUnit() {
    this.submitted = true;

    if (this.unit.arabicName?.trim()) {
      if (this.unit.id) {
        this.subscriptions.add(
          this.unitService
            .update({
              id: this.unit.id,
              arabicName: this.unit.arabicName,
              englishName: this.unit.englishName,
            })

            .subscribe((response) => {
              const unitIndex = findIndex(this.units, (unit) => unit.id === response.data.id);

              this.units[unitIndex] = response.data;
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Updated',
                life: 3000,
              });
            })
        );
      } else {
        this.subscriptions.add(
          this.unitService
            .create({
              arabicName: this.unit.arabicName,
              englishName: this.unit.englishName,
            })

            .subscribe((response) => {
              this.units.push(response);
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Created',
                life: 3000,
              });
            })
        );
      }
      this.units = [...this.units];
      this.unitDialog = false;
      this.unit = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.units.length; i++) {
      if (this.units[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
}
