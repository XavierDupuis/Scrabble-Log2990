import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddDictDialogComponent } from '@app/components/modals/add-dict-dialog/add-dict-dialog.component';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminDictComponent, DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';
import { of } from 'rxjs';

describe('admin-dictionary component', () => {
    let component: AdminDictComponent;
    let fixture: ComponentFixture<AdminDictComponent>;
    let dictHttpServiceMock: jasmine.SpyObj<DictHttpService>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    beforeEach(async () => {
        // eslint-disable-next-line no-unused-vars
        dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['uploadDict', 'getDict', 'getDictInfoList', 'deleteDict']);
        dictHttpServiceMock.getDictInfoList.and.returnValue(of([{ title: 'test', description: 'test', canEdit: true }]));
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        jasmine.createSpyObj('AdminDictComponent', ['ngOnInit']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [AdminDictComponent],
            providers: [
                { provide: DictHttpService, useValue: dictHttpServiceMock },
                { provide: MatDialog, useValue: matDialog },
            ],
        });

        fixture = TestBed.createComponent(AdminDictComponent);
        jasmine.createSpyObj('fixture.componentInstance', ['ngOnInit']);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('onInit should update the dictionary list', () => {
        component.ngOnInit();
        expect(dictHttpServiceMock.getDictInfoList).toHaveBeenCalled();
    });

    it('showUpdateMenu should open dialog', () => {
        const dictInfoMock: DictInfo = { title: 'test', description: 'test', canEdit: true };

        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
            close: () => {
                return;
            },
        } as MatDialogRef<EditDictDialogComponent>);
        component.showUpdateMenu(dictInfoMock);
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('showAddMenu should open a dialog', () => {
        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
            close: () => {
                return;
            },
        } as MatDialogRef<AddDictDialogComponent>);
        component.showAddMenu();
        expect(matDialog.open).toHaveBeenCalledOnceWith(AddDictDialogComponent, { width: '250px' });
    });

    it('deleteDict should call http service', () => {
        const dictInfoMock: DictInfo = { title: 'test', description: 'test', canEdit: true };
        dictHttpServiceMock.deleteDict.and.returnValue(of(''));
        component.deleteDict(dictInfoMock);
        expect(dictHttpServiceMock.deleteDict).toHaveBeenCalledWith(dictInfoMock.title);
    });
});