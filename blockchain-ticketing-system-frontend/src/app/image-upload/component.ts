import { Component } from '@angular/core';
import { create } from '@web3-storage/w3up-client';
import { Buffer } from 'buffer';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent {
    async processFile(imageInput: any): Promise<void> {
        const file: File = imageInput.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
        try {
            // Initialize client
            const client = await create();
            // Create Space
            const space = await client.createSpace('my-awesome-space');
            // Login client method
            const myAccount = await client.login('charlie83xt@hotmail.com');
            // Provision space
            await myAccount.provision(space.did());
            // Save space to agent state store
            await space.save();
            // Set space as current space
            await client.setCurrentSpace(space.did());
            // Upload the file to IPFS
            const cid  = await client.uploadFile(file);
           
            // Store the CID (pass it to the smart-contract)
            console.log(`Selected file CID: https://${cid}.ipfs.w3s.link`);
        } catch (error) {
            console.error('Error uploading file to IPFS:', error);
        }
    }
}
