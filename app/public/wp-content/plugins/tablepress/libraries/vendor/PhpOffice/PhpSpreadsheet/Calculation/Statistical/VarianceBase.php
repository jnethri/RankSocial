<?php

namespace TablePress\PhpOffice\PhpSpreadsheet\Calculation\Statistical;

use TablePress\PhpOffice\PhpSpreadsheet\Calculation\Functions;

abstract class VarianceBase
{
	/**
	 * @param int|float|string|bool $value
	 * @return int|float
	 */
	protected static function datatypeAdjustmentAllowStrings($value)
	{
		if (is_bool($value)) {
			return (int) $value;
		} elseif (is_string($value)) {
			return 0;
		}

		return $value;
	}

	/**
	 * @param mixed $value
	 * @return mixed
	 */
	protected static function datatypeAdjustmentBooleans($value)
	{
		if (is_bool($value) && (Functions::getCompatibilityMode() == Functions::COMPATIBILITY_OPENOFFICE)) {
			return (int) $value;
		}

		return $value;
	}
}
