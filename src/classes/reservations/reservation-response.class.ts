import { ApiProperty } from '@nestjs/swagger';
import {
  Car,
  CarBrand,
  ReservationStatus,
  type DamagePhoto,
  type DamageReport,
  type RegularUser,
  type Reservation,
  type User,
} from '@prisma/client';
import { CarResponse } from 'src/classes/cars/car-response.class';
import { DamageReportResponse } from 'src/classes/reservations/damage-reports/damage-report-response.class';
import { RegularUserResponse } from 'src/classes/users/regular-user-response.class';
import { UserResponse } from 'src/classes/users/user-response.interface';

export class ReservationResponse
  implements Omit<Reservation, 'userId' | 'carId' | 'paymentId'>
{
  @ApiProperty({ example: 1, description: 'Id' })
  public id: number;

  @ApiProperty({ description: 'User' })
  public user: UserResponse;

  @ApiProperty({ description: 'Car' })
  public car: CarResponse;

  @ApiProperty({ example: new Date(), description: 'Reservation date' })
  public startDate: Date;

  @ApiProperty({ example: 4, description: 'Reservation duration in days' })
  public duration: number;

  @ApiProperty({ example: 300, description: 'Total price for reservation' })
  public price: number;

  @ApiProperty({
    example: ReservationStatus.CONFIRMED,
    description: 'Reservation status',
  })
  public status: ReservationStatus;

  @ApiProperty({
    example: new Date(),
    description: 'Reservation creation date',
  })
  public issuedAt: Date;

  @ApiProperty({ description: '' })
  public damageReport?: DamageReportResponse;

  constructor(
    reservation: Reservation,
    car: Car,
    carBrand: CarBrand,
    user: User,
    regularUser: RegularUser,
    damageReport?: DamageReport,
    damagePhotos?: DamagePhoto[],
    damageReporter?: User,
  ) {
    this.id = reservation.id;
    this.startDate = reservation.startDate;
    this.duration = reservation.duration;
    this.price = reservation.price;
    this.status = reservation.status;
    this.issuedAt = reservation.issuedAt;

    this.user = new UserResponse(user, regularUser);
    this.car = new CarResponse(car, carBrand);

    if (damageReport && damagePhotos && damageReporter) {
      this.damageReport = new DamageReportResponse(
        damageReport,
        damageReporter,
        damagePhotos,
      );
    }
  }
}
