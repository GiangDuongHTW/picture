import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'my-slider-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    imageUrls: SafeUrl[];
    lastObjectUrl: string = '';

    constructor(private readonly sanitizer: DomSanitizer) {
        this.imageUrls = [];
    }
    onPaste(event: ClipboardEvent): void {
        const pastedImage = this.getPastedImage(event);
        if (!pastedImage) {
            return;
        }
        if (this.lastObjectUrl) {
            URL.revokeObjectURL(this.lastObjectUrl);
        }

        this.lastObjectUrl = URL.createObjectURL(pastedImage);
        this.imageUrls.unshift(this.sanitizer.bypassSecurityTrustUrl(this.lastObjectUrl));
    }
    private getPastedImage(event: ClipboardEvent): File | null {
        if (
            event.clipboardData &&
            event.clipboardData.files &&
            event.clipboardData.files.length &&
            this.isImageFile(event.clipboardData.files[0])
        ) {
            return event.clipboardData.files[0];
        }

        return null;
    }
    private isImageFile(file: File): boolean {
        return file.type.search(/^image\//i) === 0;
    }
    deleteImage(image: SafeUrl): void {
        this.imageUrls = this.imageUrls.filter((value) => value !== image);
    }
}
