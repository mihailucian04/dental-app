import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { FilePreviewOverlayRef } from './file-preview-overlay-ref';
import { FilePreviewOverlayComponent } from './file-preview-overlay.component';
import { FILE_PREVIEW_DIALOG_DATA } from './file-preview-overlay.tokens';


export interface Image {
    name: string;
    url: string;
}

interface FilePreviewDialogConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    image?: Image;
}

const DEFAULT_CONFIG: FilePreviewDialogConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel',
    image: null
};

@Injectable({
    providedIn: 'root'
})
export class FilePreviewOverlayService {

    constructor(private injector: Injector, private overlay: Overlay) { }

    open(config: FilePreviewDialogConfig = {}) {
        const dialogConfig = { ...DEFAULT_CONFIG, ...config };

        const overlayRef = this.overlay.create();

        const dialogRef = new FilePreviewOverlayRef(overlayRef);

        const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

        dialogRef.componentInstance = overlayComponent;

        overlayRef.backdropClick().subscribe(_ => dialogRef.close());

        return dialogRef;
    }

    private attachDialogContainer(overlayRef: OverlayRef, config: FilePreviewDialogConfig, dialogRef: FilePreviewOverlayRef) {
        const injector = this.createInjector(config, dialogRef);

        const containerPortal = new ComponentPortal(FilePreviewOverlayComponent, null, injector);
        const containerRef: ComponentRef<FilePreviewOverlayComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createInjector(config: FilePreviewDialogConfig, dialogRef: FilePreviewOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(FilePreviewOverlayRef, dialogRef);
        injectionTokens.set(FILE_PREVIEW_DIALOG_DATA, config.image);

        return new PortalInjector(this.injector, injectionTokens);
    }

    private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        });

        return overlayConfig;
    }
}