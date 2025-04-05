import { ApiProperty } from '@nestjs/swagger';
import { Reservation, ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, MinDate } from 'class-validator';

export class CreateReservation
  implements
    Omit<Reservation, 'id' | 'userId' | 'price' | 'issuedAt' | 'paymentId'>
{
  @ApiProperty({
    example: 1,
    description: 'Car id',
  })
  @Type(() => Number)
  @IsInt()
  public carId: number;

  @ApiProperty({
    example: new Date(),
    description: 'Start date',
  })
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  public startDate: Date;

  @ApiProperty({
    example: 4,
    description: 'Duration in days',
  })
  @Type(() => Number)
  @IsInt()
  public duration: number;

  @ApiProperty({
    example: ReservationStatus.PENDING,
    description: 'Reservation status',
  })
  @IsEnum(ReservationStatus)
  public status: ReservationStatus;
}
