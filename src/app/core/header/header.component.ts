import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sei-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() title: string;
    @Input() modalHeader: boolean;

    @Output() close: EventEmitter<void> = new EventEmitter();
    get showClose() {
        return this.modalHeader;
    }

    get showMenu() {
        return !this.modalHeader;
    }

    constructor() {}

    ngOnInit() {}

    emitClose() {
        this.close.emit();
    }
}
