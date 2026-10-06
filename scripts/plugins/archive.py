#!/usr/bin/env python3
"""Small deterministic ZIP helper using only Python's standard library."""

from __future__ import annotations

import json
import os
import stat
import sys
import zipfile
from pathlib import Path, PurePosixPath

FIXED_TIME = (1980, 1, 1, 0, 0, 0)
FIXED_MODE = stat.S_IFREG | 0o644


def package_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for current, directories, names in os.walk(root, followlinks=False):
        current_path = Path(current)
        directories.sort()
        names.sort()
        for directory in directories:
            candidate = current_path / directory
            if candidate.is_symlink():
                raise ValueError(f"Symbolic links are not allowed: {candidate}")
        for name in names:
            candidate = current_path / name
            if candidate.is_symlink() or not candidate.is_file():
                raise ValueError(f"Only regular files may be archived: {candidate}")
            files.append(candidate)
    return sorted(files, key=lambda item: item.relative_to(root).as_posix())


def validate_member(name: str) -> None:
    member = PurePosixPath(name)
    if (
        not name
        or "\\" in name
        or "\x00" in name
        or member.is_absolute()
        or any(part in ("", ".", "..") for part in name.split("/"))
        or member.as_posix() != name
    ):
        raise ValueError(f"Unsafe ZIP member path: {name!r}")


def write_archive(root: Path, archive_path: Path) -> None:
    if not root.is_dir() or root.is_symlink():
        raise ValueError(f"Expected a package directory: {root}")
    if archive_path.is_symlink():
        raise ValueError(f"Archive destination is a symbolic link: {archive_path}")

    archive_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_STORED, strict_timestamps=True) as archive:
        archive.comment = b""
        for file_path in package_files(root):
            name = file_path.relative_to(root).as_posix()
            validate_member(name)
            info = zipfile.ZipInfo(name, date_time=FIXED_TIME)
            info.create_system = 3
            info.compress_type = zipfile.ZIP_STORED
            info.external_attr = FIXED_MODE << 16
            info.extra = b""
            info.comment = b""
            archive.writestr(info, file_path.read_bytes())
    inspect_archive(archive_path)


def inspect_archive(archive_path: Path) -> list[str]:
    with zipfile.ZipFile(archive_path, "r") as archive:
        names: list[str] = []
        seen: set[str] = set()
        for info in archive.infolist():
            validate_member(info.filename)
            if info.filename in seen:
                raise ValueError(f"Duplicate ZIP entry: {info.filename}")
            seen.add(info.filename)
            if info.is_dir() or info.date_time != FIXED_TIME:
                raise ValueError(f"ZIP entry is not a fixed regular file: {info.filename}")
            if (info.external_attr >> 16) != FIXED_MODE:
                raise ValueError(f"ZIP entry has unexpected permissions: {info.filename}")
            names.append(info.filename)
        if names != sorted(names):
            raise ValueError("ZIP entries are not sorted")
        bad_member = archive.testzip()
        if bad_member is not None:
            raise ValueError(f"Corrupt ZIP entry: {bad_member}")
        return names


def extract_archive(archive_path: Path, destination: Path) -> None:
    names = inspect_archive(archive_path)
    destination.mkdir(parents=True, exist_ok=True)
    root = destination.resolve()
    with zipfile.ZipFile(archive_path, "r") as archive:
        for name in names:
            output = (destination / Path(*PurePosixPath(name).parts)).resolve()
            if output == root or not output.is_relative_to(root):
                raise ValueError(f"ZIP entry escapes extraction directory: {name}")
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(archive.read(name))
            output.chmod(0o644)


def main(arguments: list[str]) -> None:
    if len(arguments) < 2:
        raise ValueError("Usage: archive.py write|verify|extract <archive> [package-root|destination]")
    operation = arguments[0]
    archive_path = Path(arguments[1])
    if operation == "write" and len(arguments) == 3:
        write_archive(Path(arguments[2]), archive_path)
    elif operation == "verify" and len(arguments) == 2:
        print(json.dumps(inspect_archive(archive_path), separators=(",", ":")))
    elif operation == "extract" and len(arguments) == 3:
        extract_archive(archive_path, Path(arguments[2]))
    else:
        raise ValueError("Usage: archive.py write <archive> <package-root> | verify <archive> | extract <archive> <destination>")


if __name__ == "__main__":
    try:
        main(sys.argv[1:])
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        print(f"plugin archive: {error}", file=sys.stderr)
        sys.exit(1)
