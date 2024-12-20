import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, debounceTime, switchMap, tap, timer } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'users-filter',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterComponent {
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly userNameInput = new FormControl('', {
    nonNullable: true,
  });

  @Output()
  public usersFilter = new EventEmitter();

  constructor() {
    this.userNameInput.valueChanges
      .pipe(
        debounceTime(1000),
        tap(() => {
          this.isLoading$.next(true);
        }),
        switchMap((name: string) =>
          timer(500).pipe(
            tap(() => {
              this.usersFilter.emit(name);
              this.isLoading$.next(false);
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.usersFilter.emit('');
  }
}
