import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Unit } from '../models/unit.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private backendApi: string;
  private unitApi: string;
  constructor(private httpClient: HttpClient) {
    this.backendApi = environment.apiUrl;
    this.unitApi = '/api/units';
  }

  /**
   * Create unit by using the provided data.
   * @param data The Create unit data.
   */
  create(data: any): Observable<any> {
    return this.httpClient.post<Unit>(`${this.backendApi}${this.unitApi}`, data);
  }

  /**
   * get All units.
   */
  getUnits(): Observable<Unit[]> {
    return this.httpClient.get<Unit[]>(`${this.backendApi}${this.unitApi}`);
  }

  /**
   * Find unit by given id.
   * @param id The id of the unit.
   */
  findUnitById(id: any): Observable<any> {
    return this.httpClient.get<Unit>(`${this.backendApi}${this.unitApi}/${id}`);
  }

  /**
   * Updates an existing unit data using the provided data.
   * @param data The updated unit data.
   */
  update(data: any): Observable<any> {
    return this.httpClient.put<Unit>(`${this.backendApi}${this.unitApi}`, data);
  }

  /**
   * Deletes the unit by given id.
   * @param id The id of the unit.
   */
  public delete(id: number): Observable<any> {
    return this.httpClient.delete<Unit>(`${this.backendApi}${this.unitApi}/${id}`);
  }

  /**
   * Delete multiple units by given data.
   * @param data The deleted unit data.
   */
  public deleteSelectedProducts(units: number[]): Observable<any> {
    const params = new HttpParams().set('units', units.join(','));
    return this.httpClient.delete<Unit>(`${this.backendApi}${this.unitApi}/delete-selected-products`, {
      params,
    });
  }
}
