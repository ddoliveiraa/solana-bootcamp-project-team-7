import { Component } from '@angular/core';
import { create } from 'ipfs-http-client';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    // styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
    async processFile(imageInput: any): Promise<void> {
        const file: File = imageInput.files[0];
        if (file) {
            try {
                // Initialize client
                const client = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

                // Upload the file to IPFS
                const { cid } = await client.add(file);

                // Store the CID in the smart-contract
                console.log('Selected file CID:', cid.toString());
            } catch (error) {
                console.error('Error uploading file to IPFS:', error);
            }
        }
    }
}
